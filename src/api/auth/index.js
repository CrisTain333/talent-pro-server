const express = require("express");
const router = express.Router();
const {
  registerUser,
  userLogin,
} = require("../../controller/auth-controller");

const authValidation = require("./validation");

const {
  validateRequest,
} = require("../../middleware/validateRequest");

router.use(
  "/sign-up",
  validateRequest(authValidation.userRegisterValidation),
  registerUser
);

router.use(
  "/sign-in",
  validateRequest(authValidation.LoginValidation),
  userLogin
);

module.exports = router;
