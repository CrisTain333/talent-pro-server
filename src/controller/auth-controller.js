const authService = require("../services/auth-service");
const catchAsync = require("../shared/catchAsync");
const sendResponse = require("../shared/sendResponse");

// ** Register
const registerUser = catchAsync(async (req, res) => {
  const { ...registerData } = req.body;
  const result = await authService.handleRegisterUser(
    registerData
  );
  sendResponse(res, {
    data: {
      token: result?.token,
    },
    statusCode: 200,
    message: "Account Registered successfully",
  });
});

module.exports = {
  registerUser,
};
