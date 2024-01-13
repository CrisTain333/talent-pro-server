const express = require('express');
const router = express.Router();
const applicationController = require('../../controller/application-controller');
const auth = require('../../middleware/auth');
const { User_Role } = require('../../constant/user-roles');
router.post(
    '/',
    auth(User_Role.CANDIDATE),
    applicationController.applyJobController
);

module.exports = router;
