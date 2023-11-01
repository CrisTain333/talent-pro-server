const express = require("express");
const router = express.Router();
const {
  registerUser,
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

module.exports = router;
