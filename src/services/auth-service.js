const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../model/userModel');
const ApiError = require('../error/ApiError');
const config = require('../config/config');
const { logger } = require('../shared/logger');

exports.handleRegister = async userData => {
    // Check if the user already exists
    const existingUser = await User.findOne({
        $or: [{ email: userData.email }]
    });

    if (existingUser) {
        throw new ApiError(400, 'Email already in use');
    }
    // Hash the plain password
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    userData.password = hashedPassword;

    const result = await User.create(userData);
    logger.info(`User created : Id-${result._id}`);

    const payload = {
        _id: result._id,
        role: result.role
    };

    const expires = config.JWT.expires_in;
    const token = jwt.sign(payload, config.JWT.secret, {
        expiresIn: expires
    });

    // send success message
    return {
        token
    };
};

exports.handleToken = async payload => {
    const { email: userEmail, password } = payload;

    const isUserExist = await User.findOne({
        $or: [{ email: userEmail }]
    });

    // check the email exist
    if (!isUserExist) {
        throw new ApiError(404, 'No user found with this email');
    }

    // check the password
    const isPasswordMatched = await bcrypt.compare(
        password,
        isUserExist?.password
    );

    // if not matched throw error;
    if (!isPasswordMatched) {
        throw new ApiError(401, 'Invalid email or password');
    }
    const { _id, role } = isUserExist;

    const token_data = {
        _id,
        role
    };

    const expires = config.JWT.expires_in;

    const token = jwt.sign(token_data, config.JWT.secret, {
        expiresIn: expires
    });

    // send success message
    return {
        token
    };
};
