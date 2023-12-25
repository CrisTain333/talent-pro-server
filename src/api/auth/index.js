const express = require('express');
const router = express.Router();
const { register, token } = require('../../controller/auth-controller');

const authValidation = require('./validation');

const { validateRequest } = require('../../middleware/validateRequest');
const limiter = require('../../middleware/rateLimit');

router.use(
    '/register',
    validateRequest(authValidation.userRegisterValidation),
    register
);

router.use(
    '/token',
    limiter,
    validateRequest(authValidation.LoginValidation),
    token
);

module.exports = router;
