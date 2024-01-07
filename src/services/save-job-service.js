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
        user: userId
    })
        .populate('user')
        .populate('job');
    return newlySavedJob;
};

exports.getSavedJobs = async userId => {
    console.log(userId);
    if (!userId) {
        throw new ApiError(400, 'User Id is required');
    }

    const savedJobs = await SavedJob.find({
        'user._id': userId
    })
        .populate('user')
        .populate('job');
    return savedJobs;
};
