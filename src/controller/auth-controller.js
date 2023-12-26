const authService = require('../services/auth-service');
const catchAsync = require('../shared/catchAsync');
const sendResponse = require('../shared/sendResponse');

const register = catchAsync(async (req, res) => {
    const { ...registerData } = req.body;
    const result = await authService.handleRegister(registerData);

    sendResponse(res, {
        statusCode: 201,
        message: 'Registered successfully',
        data: {
            access: result?.token
        }
    });
    // res.status(201).json({
    //     access: result?.token
    // });
});

const token = catchAsync(async (req, res) => {
    const { ...tokenData } = req.body;
    const result = await authService.handleToken(tokenData);
    sendResponse(res, {
        statusCode: 200,
        message: 'Logged in successfully',
        data: {
            access: result?.token
        }
    });
    // res.status(200).json({
    //     access: result?.token
    // });
});

module.exports = {
    register,
    token
};
