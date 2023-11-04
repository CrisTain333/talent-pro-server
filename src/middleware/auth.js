const ApiError = require('../error/ApiError');
const jwt = require('jsonwebtoken');
const color = require('colors');
const auth =
    (...requiredRoles) =>
    async (req, res, next) => {
        try {
            //get authorization token
            const token = req.headers.authorization;
            console.log(token);
            if (!token) {
                throw new ApiError(
                    401,
                    'You are not authorized'
                );
            }
            // verify token
            let verifiedUser = null;

            // verifiedUser = jwtHelpers.verifyToken(
            //     token,
            //     process.env.JWT_SECRET
            // );

            verifiedUser = jwt.verify(
                token,
                process.env.JWT_SECRET
            );

            req.user = verifiedUser;
            console.log(`${verifiedUser}`.bgMagenta);

            // role diye guard korar jnno

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
