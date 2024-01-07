const ApiError = require('../error/ApiError');
const SavedJob = require('../model/saveJobModel');

exports.saveJobs = async (userId, jobId) => {
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

exports.getSavedJobs = async userId => {
    if (!userId) {
        throw new ApiError(400, 'User Id is required');
    }
    const savedJobs = await SavedJob.find({
        user: userId
    })
        .populate({
            path: 'job',
            populate: {
                path: 'organization',
                select: '_id company_logo company_name',
                model: 'Organization'
            },
            select: '_id organization job_title job_type experience_level location_type address createdAt'
        })
        .select('job');
    return savedJobs;
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
