const catchAsync = require('../shared/catchAsync');
const saveJobService = require('../services/save-job-service');
const sendResponse = require('../shared/sendResponse');

const saveJob = catchAsync(async (req, res) => {
    const { _id } = req.user;
    const jobId = req.params.id;

    const result = await saveJobService.saveJobs(_id, jobId);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Job saved successfully',
        data: result
    });
});

const getSavedJobs = catchAsync(async (req, res) => {
    const { _id } = req.user;
    const result = await saveJobService.getSavedJobs(_id);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: `Job's retrieved successfully`,
        data: result
    });
});

const removeSavedJob = catchAsync(async (req, res) => {
    const { _id } = req.user;
    const jobId = req.params.id;

    const result = await saveJobService.removeSavedJob(_id, jobId);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Successfully removed from saved jobs',
        data: result
    });
});

module.exports = {
    saveJob,
    getSavedJobs,
    removeSavedJob
};
