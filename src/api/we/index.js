const express = require('express');
const router = express.Router();

const jobController = require('../../controller/job-controller');
const weController = require('../../controller/we-controller');

const uploader = require('../../middleware/uploader');
const auth = require('../../middleware/auth');
const { User_Role } = require('../../constant/user-roles');

router.get('/', auth(User_Role.RECRUITER), weController.getOrganization);
router.post(
    '/',
    uploader.single('company_logo'),
    auth(User_Role.RECRUITER, User_Role.SUPER_ADMIN),
    weController.createOrganization
);

// ** ---------------------- Recruiter Job Routes ----------------------

router.post('/job', auth(User_Role.RECRUITER), jobController.createNewJob);

router.get(
    '/job',
    auth(User_Role.RECRUITER, User_Role.SUPER_ADMIN),
    jobController.getRecruiterJobList
);

router.get(
    '/job/:id',
    auth(User_Role.RECRUITER, User_Role.SUPER_ADMIN),
    jobController.getRecruiterSingleJob
);

module.exports = router;
