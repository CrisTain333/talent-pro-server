const { default: mongoose } = require('mongoose');
const ApiError = require('../error/ApiError');
const Application = require('../model/applicationModel');
const Job = require('../model/jobModel');
const { uploadFiles } = require('../shared/uploadFile');
const calculatePagination = require('../helper/paginationHelper');
const { appliedJobSearchAbleField } = require('../constant/keyChain');
const Organization = require('../model/organizationModel');

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

    const { page, limit, skip, sortBy, sortOrder } =
        calculatePagination(paginationOptions);

    const { search, ...filterData } = filter;

    const org = await Organization.findOne({
        user_id: new mongoose.Types.ObjectId(userId)
    });

    const orgId = new mongoose.Types.ObjectId(org._id).toHexString();

    const andConditions = [
        {
            organization: new mongoose.Types.ObjectId(orgId)
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
            path: 'user',
            select: 'name email image_url'
        })
        .populate({
            path: 'candidate',
            select: 'gender date_of_birth location desired_salary'
        })
        .select(
            '-job.job_type -job.experience_level -job.location_type -organization -skills -updatedAt -__v'
        )
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

exports.getApplicationByJob = async JobId => {
    const allApplications = await Application.find({ 'job._id': JobId });
    return allApplications;
};

exports.getSingleApplication = async (JobId, applicationId) => {
    console.log(applicationId);

    const singleApplication = await Application.findOne({
        _id: applicationId
    }).populate('user candidate organization');
    return singleApplication;
};
