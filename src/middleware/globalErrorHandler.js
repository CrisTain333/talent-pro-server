// import { ErrorRequestHandler } from "express";
// import handleValidationError from "../error/handleValidationError";
// import { IGenericErrorMessage } from "../interface/error";
// import config from "../config";
// import ApiError from "../error/ApiError";
// import { ZodError } from "zod";
const { ZodError } = require('zod');
const ApiError = require('../error/ApiError');
// import handleZodError from "../error/zodErrorHandler";
// import { errorLogger } from '../shared/logger';
// import handleCastError from "../error/handleCastError";

const {
    handleZodError
} = require('../error/zodErrorHandler');

exports.globalErrorHandler = (error, req, res, next) => {
    let statusCode = 500;
    let message = 'Something went wrong !';
    let errorMessages = [];

    if (error instanceof ZodError) {
        const simplifiedError = handleZodError(error);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorMessages = simplifiedError.errorMessages;
    } else if (error instanceof ApiError) {
        statusCode = error?.statusCode;
        message = error.message;
        errorMessages = error?.message
            ? [
                  {
                      path: '',
                      message: error?.message
                  }
              ]
            : [];
    }

    //   if (error?.name === "ValidationError") {
    //     const simplifiedError = handleValidationError(error);
    //     statusCode = simplifiedError.statusCode;
    //     message = simplifiedError.message;
    //     errorMessages = simplifiedError.errorMessages;
    //   } else if (error instanceof ZodError) {
    //     const simplifiedError = handleZodError(error);
    //     statusCode = simplifiedError.statusCode;
    //     message = simplifiedError.message;
    //     errorMessages = simplifiedError.errorMessages;
    //   } else if (error?.name === "CastError") {
    //     const simplifiedError = handleCastError(error);
    //     statusCode = simplifiedError.statusCode;
    //     message = simplifiedError.message;
    //     errorMessages = simplifiedError.errorMessages;
    //   } else if (error.code === 11000) {
    //     statusCode = 409;
    //     message = "Duplicate Entry";
    //     errorMessages.push({
    //       path: "",
    //       message: error.message,
    //     });
    //   } else if (error instanceof ApiError) {
    //     statusCode = error?.statusCode;
    //     message = error.message;
    //     errorMessages = error?.message
    //       ? [
    //           {
    //             path: "",
    //             message: error?.message,
    //           },
    //         ]
    //       : [];
    //   } else if (error instanceof Error) {
    //     message = error?.message;
    //     errorMessages = error?.message
    //       ? [
    //           {
    //             path: "",
    //             message: error?.message,
    //           },
    //         ]
    //       : [];
    //   }

    res.status(statusCode).json({
        success: false,
        message,
        errorMessages,
        stack:
            process.env.NODE_ENV !== 'production'
                ? error?.stack
                : undefined
    });
};
// module globalErrorHandler;
