const ApiError = require('../error/ApiError');
const User = require('../model/userModel');

exports.getMe = async userId => {
    if (!userId) {
        throw new ApiError(401, 'User Id is required');
    }

    const user = await User.findById(userId).select(
        '-password -createdAt -updatedAt'
    );
    return user;
};
