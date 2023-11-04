const express = require('express');
const router = express.Router();

const meController = require('../../controller/me-controller');
const auth = require('../../middleware/auth');
const {
    validateRequest
} = require('../../middleware/validateRequest');
const userValidation = require('./validation');
const { User_Role } = require('../../constant/user-roles');

router.get('/', auth(), meController.getMe);
router.patch(
    '/',
    validateRequest(userValidation.userUpdateValidation),
    auth(User_Role.CANDIDATE),
    meController.updateUser
);

module.exports = router;
