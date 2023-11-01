const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../model/userModel");
const { User_Role } = require("../constant/user-roles");

exports.handleRegisterUser = async (userData) => {
  try {
    // Check if the user already exists
    const existingUser = await User.findOne({
      $or: [{ email: userData.email }],
    });

    if (existingUser) {
      return {
        success: false,
        status: 400,
        message: "Email already in use",
      };
    }
    // Hash the plain password
    const hashedPassword = await bcrypt.hash(
      userData.password,
      10
    );

    userData.role = User_Role.CANDIDATE;
    userData.password = hashedPassword;

    const result = await User.create(userData);

    const payload = {
      role: userData.role,
      id: result.id,
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    );

    // send success message
    return {
      success: true,
      status: 201,
      message: `Account created successfully`,
      token,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      status: 500,
      message: "failed to create account",
    };
  }
};
