const authService = require("../services/auth-service");
const registerUser = async (req, res, next) => {
  try {
    const data = req.body;

    const result = await authService.handleRegisterUser(
      data
    );
    res.send({
      status: result?.status,
      message: result?.message,
      success: result?.success,
      token: result?.token,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
};
