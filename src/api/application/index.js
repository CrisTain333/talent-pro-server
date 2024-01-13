const express = require('express');
const router = express.Router();
const applicationController = require('../../controller/application-controller');
const auth = require('../../middleware/auth');
const { User_Role } = require('../../constant/user-roles');
const uploader = require('../../middleware/uploader');
router.post(
    '/',
    auth(User_Role.CANDIDATE),
    uploader.single('resume'),

    applicationController.applyJobController
);

module.exports = router;
