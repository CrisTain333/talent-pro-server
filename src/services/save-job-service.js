const ApiError = require('../error/ApiError');
const SavedJob = require('../model/saveJobModel');
const calculatePagination = require('../helper/paginationHelper');
const { default: mongoose } = require('mongoose');

exports.saveJob = async (userId, jobId) => {
    if (!userId || !jobId) {
        throw new ApiError(400, 'User Id or Job Id is required');
    }

    const isJobAllReadyExists = await SavedJob.findOne({
        job: jobId,
        user: userId
    });

    if (isJobAllReadyExists) {
        throw new ApiError(400, 'Job is already saved');
    }

    await SavedJob.create({
        user: userId,
        job: jobId
    });

    const newlySavedJob = await SavedJob.find({
        user: userId,
        job: jobId
    });
    return newlySavedJob;
};

exports.getSavedJobs = async (userId, paginationOptions, filters) => {
    if (!userId) {
        throw new ApiError(400, 'User Id is required');
    }

    const { page, limit, skip, sortBy, sortOrder } =
        calculatePagination(paginationOptions);

    const { search } = filters;

    const andConditions = [
        {
            user: new mongoose.Types.ObjectId(userId)
        }
    ];

    // Dynamic Sort needs field to do sorting
    const sortConditions = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }

    const whereConditions =
        andConditions.length > 0 ? { $and: andConditions } : {};

    const savedJobs = await SavedJob.find(whereConditions)
        .populate({
            path: 'job',
            populate: {
                path: 'organization',
                select: '_id company_logo company_name',
                model: 'Organization'
            },
            select: '_id organization job_title job_type experience_level location_type address createdAt'
        })
        .select('_id job createdAt')
        .sort(sortConditions)
        .skip(skip)
        .limit(limit);

    const filteredJobs = search
        ? savedJobs.filter(job =>
              job.job.job_title.match(new RegExp(search, 'i'))
          )
        : savedJobs;

    const total = filteredJobs.length;

    return {
        meta: {
            page,
            limit,
            total
        },
        data: filteredJobs
    };
};

exports.saveJobsList = async userId => {
    if (!userId) {
        throw new ApiError(400, 'User Id is required');
    }
    const savedJobsList = await SavedJob.find({
        user: userId
    })
        .populate({
            path: 'job',
            select: '_id'
        })
        .select('job');
    return savedJobsList;
};

exports.removeSavedJob = async (userId, jobId) => {
    if (!userId || !jobId) {
        throw new ApiError(400, 'User Id or Job Id is required');
    }

    const result = await SavedJob.findOneAndDelete({
        job: jobId,
        user: userId
    });

    return result;
};
