const { default: mongoose } = require('mongoose');
const ApiError = require('../error/ApiError');
const Application = require('../model/applicationModel');
const Job = require('../model/jobModel');
const User = require('../model/userModel');
const { uploadFiles } = require('../shared/uploadFile');
const color = require('colors');
const calculatePagination = require('../helper/paginationHelper');
const { appliedJobSearchAbleField } = require('../constant/keyChain');

exports.applyJob = async (userId, resume, requestedData) => {
    const jobId = requestedData.job._id;

    console.log(`Checking if user already applied ${jobId}`.bgCyan);
    const job = await Job.findOne({
        _id: jobId
    });

    // console.log

    if (job && job.applied_by && job.applied_by.includes(userId)) {
        console.log(`Job already applied`.bgRed);
        console.log(job);
        throw new ApiError(400, 'You have already applied for this job');
    }
    console.log('used not  applied . . . . . '.bgGreen);

    console.log('uploading resume . . . . ');

    const uploadedResume = await uploadFiles(resume);
    if (!uploadedResume) {
        throw ApiError(400, 'Failed to update resume');
    }

    console.log('resume uploaded: ' + uploadedResume[0]);

    requestedData.resume = uploadedResume[0];

    const session = await mongoose.startSession();

    try {
        session.startTransaction();
        console.log('applying to job . . . . '.bgCyan);

        const newlyAppliedData = await Application.create([requestedData], {
            session
        });
        if (!newlyAppliedData) {
            console.log('failed to create application'.bgRed);
            throw new ApiError(400, 'Failed to create application');
        }

        console.log('updating job state . . . .'.bgCyan);

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
            console.log('failed to update job state'.bgRed);
            throw new ApiError(400, 'failed to update job state');
        }
        console.log('job state updated'.bgGreen);
        console.log('applied to job successfully'.bgGreen);
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
        .populate('candidate organization user')
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
