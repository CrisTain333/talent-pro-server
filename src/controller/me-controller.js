const catchAsync = require('../shared/catchAsync');
const meService = require('../services/me-service');
const sendResponse = require('../shared/sendResponse');
const getMe = catchAsync(async (req, res) => {
    const { _id } = req.user;
    const result = await meService.getMe(_id);
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Profile Retrieved Successfully',
        data: result
    });
});

module.exports = { getMe };
