const { User_Role } = require('../constant/user-roles');
const ApiError = require('../error/ApiError');

const checkAccess = async (user, Model, fieldsToFilter, checkingField) => {
    try {
        const resource = await Model.find(fieldsToFilter);

        if (!resource) {
            throw new ApiError(404, 'Resource not found');
        }

        // Check if the user has permission to update the resource
        if (resource?.checkingField !== user._id) {
            throw new ApiError(
                403,
                'Unauthorized - User does not have permission to update'
            );
        }

        // This might involve different checks based on your specific logic and application requirements

        // Example: Check if the user is the creator of the resource
        // if (String(resource.createdBy) !== String(user._id)) {
        //     throw new ApiError(
        //         403,
        //         'Unauthorized - User does not have permission to update'
        //     );
        // }

        // Add more permission checks based on your application's logic

        // If all checks pass, return true indicating access is granted
        return true;
    } catch (error) {
        // Handle errors or unauthorized access
        throw new ApiError(
            error.statusCode || 500,
            error.message || 'Internal Server Error'
        );
    }
};

module.exports = checkAccess;
