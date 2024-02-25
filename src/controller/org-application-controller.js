const catchAsync = require('../shared/catchAsync');
const sendResponse = require('../shared/sendResponse');

const OrgApplicationService = require('../services/org-application-service');

const getApplicationByORG = catchAsync(async (req, res) => {
    const { _id } = req.user;

    const result = await OrgApplicationService.getApplicationByOrg(_id);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Applications retrieved successfully',
        data: result
    });
});

const getApplicationByJob = catchAsync(async (req, res) => {
    const { jobId } = req.params;

    const result = await OrgApplicationService.getApplicationByJob(jobId);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Applications retrieved successfully',
        data: result
    });
});
const getSingleApplication = catchAsync(async (req, res) => {
    const { JobId, applicationId } = req.params;

    const result = await OrgApplicationService.getSingleApplication(
        JobId,
        applicationId
    );
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Applications retrieved successfully',
        data: result
    });
});

module.exports = {
    getApplicationByORG,
    getApplicationByJob,
    getSingleApplication
};
