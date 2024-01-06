const ApiError = require('../error/ApiError');
const SavedJob = require('../model/saveJobModel');

exports.saveJobs = async (userId, jobId) => {
    if (!userId || !jobId) {
        throw new ApiError(400, 'User Id or Job Id is required');
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
