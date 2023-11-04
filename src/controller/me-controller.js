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

const updateProfilePicture = catchAsync(
    async (req, res) => {
        const file = req.file;
        const result =
            await meService.updateProfilePicture(file);
        sendResponse(res, {
            statusCode: 201,
            success: true,
            message: 'Profile picture updated successfully',
            data: result
        });
    }
);

const updateUser = catchAsync(async (req, res) => {
    const { _id } = req.user;
    const { ...userData } = req.body;
    const result = await meService.updateProfile(
        _id,
        userData
    );
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message:
            'Profile Updated Successfully Successfully',
        data: result
    });
});

module.exports = {
    getMe,
    updateUser,
    updateProfilePicture
};
