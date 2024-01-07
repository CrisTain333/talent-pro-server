const catchAsync = require('../shared/catchAsync');
const saveJobService = require('../services/auth-service');
const sendResponse = require('../shared/sendResponse');

const saveJob = catchAsync(async (req, res) => {
    const { _id } = req.user;
    console.log('user id: ' + _id);
    const jobId = req.params.id;
    console.log('job id: ' + jobId);

    const result = await saveJobService.saveJobs(_id, jobId);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Job saved successfully',
        data: result
    });
});

const getSavedJobs = catchAsync(async (req, res) => {
    console.log(req);
    // const { _id } = req.user;
    // console.log('user id:' + _id);
    // const result = await jobService.getSavedJobs(_id);
    // sendResponse(res, {
    //     statusCode: 200,
    //     success: true,
    //     message: `Job's retrieved successfully`,
    //     data: result
    // });
});

module.exports = {
    saveJob,
    getSavedJobs
};
