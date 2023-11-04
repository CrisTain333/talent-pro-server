const catchAsync = require('../shared/catchAsync');
const meService = require('../services/me-service');

const getMe = catchAsync(async (req, res) => {
    const { _id } = req.user;
    const result = await meService.getMe(_id);
    // res.status(200).json({
    //     access: result?.token
    // });
});

module.exports = {};
