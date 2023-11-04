const ApiError = require('../error/ApiError');
const jwt = require('jsonwebtoken');
const color = require('colors');
const auth =
    (...requiredRoles) =>
    async (req, res, next) => {
        try {
            //Get authorization token
            const bearer_token = req.headers.authorization;
            const token = bearer_token.split(' ')[1];
            console.log(token);
            if (!token) {
                throw new ApiError(
                    401,
                    'You are not authorized'
                );
            }
            let verifiedUser = null;

            // verify token
            verifiedUser = jwt.verify(
                token,
                process.env.JWT_SECRET
            );
            req.user = verifiedUser;

            // Guard By ROLE
            if (
                requiredRoles.length &&
                !requiredRoles.includes(verifiedUser.role)
            ) {
                throw new ApiError(
                    401,
                    `You Don't have permission to access this.`
                );
            }
            next();
        } catch (error) {
            next(error);
        }
    };

module.exports = auth;
