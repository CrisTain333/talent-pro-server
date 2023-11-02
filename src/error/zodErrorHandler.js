exports.handleZodError = error => {
    const errors = error?.issues?.map(issue => {
        return {
            path: issue?.path[issue?.path?.length - 1],
            message: issue?.message
        };
    });

    return {
        statusCode: 400,
        message: 'Validation Error',
        errorMessages: errors
    };
};
