const authService = require("../services/auth-service");
const sendResponse = require("../shared/sendResponse");
const registerUser = async (req, res, next) => {
  try {
    const data = req.body;
    const result = await authService.handleRegisterUser(
      data
    );
    sendResponse(res, {
      data: {
        token: result?.token,
      },
      statusCode: 200,
      message: "Registered successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
};
