const catchAsync = require('../shared/catchAsync');
const sendResponse = require('../shared/sendResponse');

const weService = require('../services/we-service');

const createOrganization = catchAsync(async (req, res) => {
    const { ...organizationData } = req.body;
    const logo = req.file;
    const user = req.user;

    const result = await weService.createOrganization(
        user,
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

const getOrganization = catchAsync(async (req, res) => {
    const user = req.user;

    const result = await weService.getOrganization(user?._id);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Organization retrieved successfully',
        data: result
    });
});

// Organization dashboard section

const getOrganizationDashboard = catchAsync(async (req, res) => {
    const user = req.user;

    const result = await weService.getOrganizationDashboard(user?._id);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Organization dashboard retrieved successfully',
        data: result
    });
});

module.exports = {
    createOrganization,
    getOrganization,
    getOrganizationDashboard
};
