const express = require('express');
const router = express.Router();

const weController = require('../../controller/we-controller');
const uploader = require('../../middleware/uploader');
const auth = require('../../middleware/auth');
const { User_Role } = require('../../constant/user-roles');

router.post(
    '/profile',
    uploader.single('company-logo'),
    auth(User_Role.RECRUITER),
    weController.createOrganization
);

module.exports = router;
