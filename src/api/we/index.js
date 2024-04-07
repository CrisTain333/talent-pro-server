const express = require('express');
const router = express.Router();

const applicationController = require('../../controller/application-controller');
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

// Applications section
router.get(
    '/job/application',
    auth(User_Role.RECRUITER),
    applicationController.getApplicationByOrganization
);

router.get(
    '/job/:jobId/application/:applicationId',
    auth(User_Role.RECRUITER),
    applicationController.getSingleApplication
);

router.get(
    '/job/:jobId/application',
    auth(User_Role.RECRUITER),
    applicationController.getApplicationByJob
);

router.get(
    '/job/:id',
    auth(User_Role.RECRUITER, User_Role.SUPER_ADMIN),
    jobController.getRecruiterSingleJob
);

router.patch('/job/:id', auth(User_Role.RECRUITER), jobController.updateJob);

router.patch(
    '/job/:id/status',
    auth(User_Role.RECRUITER),
    jobController.updateJobStatus
);

router.delete('/job/:id', auth(User_Role.RECRUITER), jobController.deleteJob);

// ** ---------------------- Recruiter Dashboard Routes ----------------------

router.get(
    '/dashboard',
    auth(User_Role.RECRUITER, User_Role.SUPER_ADMIN),
    weController.getOrganizationDashboard
);

module.exports = router;
