const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../model/userModel");
const ApiError = require("../error/ApiError");

exports.handleRegister = async (userData) => {
  // Check if the user already exists
  const existingUser = await User.findOne({
    $or: [{ email: userData.email }],
  });

  if (existingUser) {
    throw new ApiError(400, "Email already in use");
  }
  // Hash the plain password
  const hashedPassword = await bcrypt.hash(userData.password, 10);

  userData.password = hashedPassword;

  const result = await User.create(userData);

  const payload = {
    _id: result._id,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  // send success message
  return {
    token,
  };
};

exports.handleToken = async (payload) => {
  const { email: userEmail, password } = payload;

  const isUserExist = await User.findOne({
    $or: [{ email: userEmail }],
  });

  // check the email exist
  if (!isUserExist) {
    throw new ApiError(404, "No User with this email ");
  }

  // check the password
  const isPasswordMatched = await bcrypt.compare(
    password,
    isUserExist?.password
  );

  // if not matched throw error;
  if (!isPasswordMatched) {
    throw new ApiError(401, "Invalid credentials");
  }
  const { _id } = isUserExist;

  const token_data = {
    _id,
  };

  const token = jwt.sign(token_data, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  // send success message
  return {
    token,
  };
};
