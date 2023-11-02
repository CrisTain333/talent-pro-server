const authService = require('../services/auth-service');
const catchAsync = require('../shared/catchAsync');

const register = catchAsync(async (req, res) => {
    const { ...registerData } = req.body;
    const result =
        await authService.handleRegister(registerData);
    res.status(201).json({
        access: result?.token
    });
});

const token = catchAsync(async (req, res) => {
    const { ...tokenData } = req.body;
    const result = await authService.handleToken(tokenData);
    res.status(200).json({
        access: result?.token
    });
});

module.exports = {
    register,
    token
};
