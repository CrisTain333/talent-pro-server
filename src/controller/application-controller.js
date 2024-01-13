const catchAsync = require('../shared/catchAsync');
const applicationService = require('../services/application-service');
const sendResponse = require('../shared/sendResponse');
const applyJobController = catchAsync(async (req, res) => {
    const { _id } = req.user;
    const { ...applicationData } = req.body;
    const resume = req.file;
    const result = await applicationService.applyJob(
        _id,
        resume,
        applicationData
    );
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Applied to job successfully',
        data: result
    });
});

module.exports = {
    applyJobController
};
