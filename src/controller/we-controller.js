const catchAsync = require('../shared/catchAsync');
const sendResponse = require('../shared/sendResponse');

const weService = require('../services/we-service');

const createOrganization = catchAsync(async (req, res) => {
    const { ...organizationData } = req.body;
    const logo = req.file;

    const result = await weService.createOrganization(
        organizationData,
        logo
    );

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Organization created successfully',
        data: result
    });
});

module.exports = {
    createOrganization
};