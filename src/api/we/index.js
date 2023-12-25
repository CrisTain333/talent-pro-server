const express = require('express');
const router = express.Router();

const weController = require('../../controller/we-controller');
const uploader = require('../../middleware/uploader');
const auth = require('../../middleware/auth');
const { User_Role } = require('../../constant/user-roles');

router.get('/profile', auth(User_Role.RECRUITER), weController.getOrganization);
router.post(
    '/profile',
    uploader.single('company_logo'),
    auth(User_Role.RECRUITER, User_Role.SUPER_ADMIN),
    weController.createOrganization
);

module.exports = router;
