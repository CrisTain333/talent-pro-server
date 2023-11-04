const ApiError = require('../error/ApiError');
const bcrypt = require('bcrypt');
const User = require('../model/userModel');
const { uploadFiles } = require('../shared/uploadFile');

exports.getMe = async userId => {
    if (!userId) {
        throw new ApiError(401, 'User Id is required');
    }

    const user = await User.findById(userId).select(
        '-password -createdAt -updatedAt -__v'
    );
    return user;
};

exports.updateProfile = async (userId, updatedData) => {
    if (!userId) {
        throw new ApiError(400, 'User Id is required');
    } else if (!updatedData) {
        throw new ApiError(400, 'Data is required');
    }

    if (updatedData?.email) {
        // Remove the email field from updatedData to prevent email updates
        delete updatedData.email;
    }

    if (updatedData?.password) {
        const hashedPassword = await bcrypt.hash(
            updatedData.password,
            10
        );
        updatedData.password = hashedPassword;
    }

    const result = await User.findByIdAndUpdate(
        userId,
        updatedData,
        {
            new: true,
            select: '-password -createdAt -updatedAt -__v'
        }
    );

    console.log(result);

    return result;
};

exports.updateProfilePicture = async file => {
    console.log(file);

    const imageUrl = await uploadFiles(file);
    console.log(imageUrl);
};
