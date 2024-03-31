const { default: mongoose, Mongoose } = require('mongoose');
const ApiError = require('../error/ApiError');
const Application = require('../model/applicationModel');
const Job = require('../model/jobModel');
const { uploadFiles } = require('../shared/uploadFile');
const calculatePagination = require('../helper/paginationHelper');
const { appliedJobSearchAbleField } = require('../constant/keyChain');
const Organization = require('../model/organizationModel');
const User = require('../model/userModel');

exports.applyJob = async (userId, jobId, resume, requestedData) => {
    const job = await Job.findOne({
        _id: jobId
    });

    if (job && job.applied_by && job.applied_by.includes(userId)) {
        throw new ApiError(400, 'You have already applied for this job');
    }

    const uploadedResume = await uploadFiles(resume);
    if (!uploadedResume) {
        throw ApiError(400, 'Failed to update resume');
    }

    requestedData.resume = uploadedResume[0];

    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const newlyAppliedData = await Application.create([requestedData], {
            session
        });
        if (!newlyAppliedData) {
            throw new ApiError(400, 'Failed to create application');
        }

        const updateJObState = await Job.findByIdAndUpdate(
            newlyAppliedData[0].job,

            {
                $inc: { total_applications: 1 },
                $push: { applied_by: userId }
            },
            {
                new: true,
                session
            }
        );

        if (!updateJObState) {
            throw new ApiError(400, 'failed to update job state');
        }
        await session.commitTransaction();
        await session.endSession();
    } catch (error) {
        await session.abortTransaction();
        await session.endSession();
        throw error;
    } finally {
        await session.endSession();
    }

    const application = await Application.findOne({
        user: userId,
        'job._id': requestedData.job._id
    });
    return application;
};

exports.getAppliedJobs = async function (userId, paginationOptions, filter) {
    if (!userId) {
        throw new ApiError(400, 'User Id is required');
    }

    const { page, limit, skip, sortBy, sortOrder } =
        calculatePagination(paginationOptions);

    const { search, ...filterData } = filter;

    const andConditions = [
        {
            user: new mongoose.Types.ObjectId(userId)
        }
    ];

    if (search) {
        andConditions.push({
            $or: appliedJobSearchAbleField.map(field => ({
                [field]: {
                    $regex: search,
                    $options: 'i'
                }
            }))
        });
    }
    if (Object.keys(filterData).length) {
        andConditions.push({
            $and: Object.entries(filterData).map(([field, value]) => ({
                [field]: value
            }))
        });
    }

    // Dynamic Sort needs field to do sorting
    const sortConditions = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }

    const whereConditions =
        andConditions.length > 0 ? { $and: andConditions } : {};

    const result = await Application.find(whereConditions)
        .populate({
            path: 'organization',
            select: '_id company_logo company_name company_location'
        })
        .select('createdAt status organization job')
        .sort(sortConditions)
        .skip(skip)
        .limit(limit);

    const total = await Application.countDocuments(whereConditions);

    return {
        meta: {
            page,
            limit,
            total
        },
        data: result
    };
};

exports.getApplicationByOrganization = async (
    userId,
    paginationOptions,
    filter
) => {
    if (!userId) {
        throw new ApiError(400, 'User Id is required');
    }

    const org = await Organization.findOne({
        user_id: new mongoose.Types.ObjectId(userId)
    });

    const orgId = new mongoose.Types.ObjectId(org._id).toHexString();

    const { page, limit, skip, sortBy, sortOrder } =
        calculatePagination(paginationOptions);
    const { search, ...filterData } = filter;

    const pipeline = [
        {
            $match: {
                organization: new mongoose.Types.ObjectId(orgId)
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'user',
                foreignField: '_id',
                as: 'user'
            }
        },
        { $unwind: '$user' },
        {
            $lookup: {
                from: 'candidates',
                localField: 'candidate',
                foreignField: '_id',
                as: 'candidate'
            }
        },
        { $unwind: '$candidate' },
        {
            $project: {
                _id: 1,
                job: {
                    _id: 1,
                    job_title: 1
                },
                user: {
                    name: 1,
                    email: 1,
                    image_url: 1
                },
                candidate: {
                    gender: 1,
                    date_of_birth: 1,
                    location: 1,
                    desired_salary: 1
                },
                phone: 1,
                years_of_experience: 1,
                resume: 1,
                status: 1,
                createdAt: 1
            }
        }
    ];

    if (search) {
        pipeline.push({
            $match: {
                $or: appliedJobSearchAbleField.map(field => ({
                    [field]: {
                        $regex: search,
                        $options: 'i'
                    }
                }))
            }
        });
    }

    if (Object.keys(filterData).length) {
        pipeline.push({
            $match: filterData
        });
    }

    if (sortBy && sortOrder) {
        const sortStage = {
            $sort: {
                [sortBy]: sortOrder === 'ascending' ? 1 : -1
            }
        };
        pipeline.push(sortStage);
    }

    pipeline.push({ $skip: skip }, { $limit: limit });

    const applications = await Application.aggregate(pipeline);

    const totalPipeline = [...pipeline];

    totalPipeline.pop();
    totalPipeline.pop();
    const total = await Application.aggregate([
        ...totalPipeline,
        { $count: 'total' }
    ]);

    return {
        meta: {
            page,
            limit,
            total: total.length > 0 ? total[0].total : 0
        },
        data: applications
    };
};

exports.getApplicationByJob = async (JobId, paginationOptions, filter) => {
    const { page, limit, skip, sortBy, sortOrder } =
        calculatePagination(paginationOptions);
    const { search, ...filterData } = filter;

    const pipeline = [
        { $match: { 'job._id': new mongoose.Types.ObjectId(JobId) } },
        {
            $lookup: {
                from: 'users',
                localField: 'user',
                foreignField: '_id',
                as: 'user'
            }
        },
        { $unwind: '$user' },
        {
            $lookup: {
                from: 'candidates',
                localField: 'candidate',
                foreignField: '_id',
                as: 'candidate'
            }
        },
        { $unwind: '$candidate' },
        {
            $project: {
                _id: 1,
                job: {
                    _id: 1,
                    job_title: 1
                },
                user: {
                    name: 1,
                    email: 1,
                    image_url: 1
                },
                candidate: {
                    gender: 1,
                    date_of_birth: 1,
                    location: 1,
                    desired_salary: 1
                },
                phone: 1,
                years_of_experience: 1,
                resume: 1,
                status: 1,
                createdAt: 1
            }
        }
    ];

    if (search) {
        pipeline.push({
            $match: {
                $or: appliedJobSearchAbleField.map(field => ({
                    [field]: {
                        $regex: search,
                        $options: 'i'
                    }
                }))
            }
        });
    }

    if (Object.keys(filterData).length) {
        pipeline.push({
            $match: filterData
        });
    }

    if (sortBy && sortOrder) {
        const sortStage = {
            $sort: {
                [sortBy]: sortOrder === 'ascending' ? 1 : -1
            }
        };
        pipeline.push(sortStage);
    }

    pipeline.push({ $skip: skip }, { $limit: limit });

    const applications = await Application.aggregate(pipeline);

    const totalPipeline = [...pipeline];

    totalPipeline.pop();
    totalPipeline.pop();
    const total = await Application.aggregate([
        ...totalPipeline,
        { $count: 'total' }
    ]);

    return {
        meta: {
            page,
            limit,
            total: total.length > 0 ? total[0].total : 0
        },
        data: applications
    };
};

exports.getSingleApplication = async (jobId, applicationId, user) => {
    const organization = await Organization.findOne({
        user_id: user._id
    });

    if (!organization) {
        throw new ApiError(400, 'Organization not found');
    }

    const isOwnJob = await Job.findOne({
        _id: jobId,
        organization: organization._id
    });

    if (!isOwnJob) {
        throw new ApiError(
            400,
            'You are not authorized to view this application'
        );
    }

    const singleApplication = await Application.findOne({
        'job._id': jobId,
        _id: applicationId
    }).populate('user candidate organization');

    if (singleApplication.status === 'application_received') {
        const updatedSingleApplication = await Application.findByIdAndUpdate(
            applicationId,
            {
                $set: {
                    status: 'application_in_review'
                }
            },
            {
                new: true
            }
        );

        return updatedSingleApplication;
    }

    return singleApplication;
};
