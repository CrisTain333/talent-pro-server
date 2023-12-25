const express = require('express');
const router = express.Router();

const jobController = require('../../controller/job-controller');
const auth = require('../../middleware/auth');
const { User_Role } = require('../../constant/user-roles');

router.post(
    '/',
    auth(User_Role.RECRUITER, User_Role.SUPER_ADMIN),
    jobController.postJob
);

module.exports = router;
