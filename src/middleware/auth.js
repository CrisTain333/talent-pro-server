const ApiError = require('../error/ApiError');
const jwt = require('jsonwebtoken');
const color = require('colors');
const config = require('../config/config');
const auth =
    (...requiredRoles) =>
    async (req, res, next) => {
        try {
            //Get authorization token
            const bearer_token = req.headers.authorization;
            if (!bearer_token) {
                throw new ApiError(
                    401,
                    'Token is required for authorization'
                );
            }
            const token = bearer_token.split(' ')[1];
            let verifiedUser = null;

            // verify token
            verifiedUser = jwt.verify(
                token,
                config.JWT.secret
            );
            req.user = verifiedUser;

            // Guard By ROLE
            if (
                requiredRoles.length &&
                !requiredRoles.includes(verifiedUser.role)
            ) {
                throw new ApiError(
                    403,
                    `You Don't have permission to access this.`
                );
            }
            next();
        } catch (error) {
            next(error);
        }
    };

module.exports = auth;
