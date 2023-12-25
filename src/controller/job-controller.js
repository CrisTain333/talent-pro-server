const catchAsync = require('../shared/catchAsync');
const sendResponse = require('../shared/sendResponse');

const jobService = require('../services/job-service');

const postJob = catchAsync(async (req, res) => {
    const { ...jobData } = req.body;

    const result = await jobService.postJob(jobData);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Job posted successfully',
        data: result
    });
});

module.exports = {
    postJob
};
