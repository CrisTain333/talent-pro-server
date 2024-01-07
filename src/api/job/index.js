const express = require('express');
const router = express.Router();

const jobController = require('../../controller/job-controller');
const auth = require('../../middleware/auth');
const { User_Role } = require('../../constant/user-roles');
const savedJobController = require('../../controller/save-job-controller');

router.post(
    '/save-job/:id',
    auth(User_Role.CANDIDATE),
    savedJobController.saveJob
);

router.post(
    '/',
    auth(User_Role.RECRUITER, User_Role.SUPER_ADMIN),
    jobController.postJob
);
router.get(
    '/:id',
    auth(User_Role.CANDIDATE, User_Role.RECRUITER, User_Role.SUPER_ADMIN),
    jobController.getSingleJob
);
router.get('/public/:id', jobController.getPublicSingleJob);
router.get(
    '/',
    auth(User_Role.CANDIDATE, User_Role.RECRUITER, User_Role.SUPER_ADMIN),
    jobController.getAllJobs
);
router.patch(
    '/update-status/:id',
    auth(User_Role.RECRUITER),
    jobController.updateJobStatus
);
router.patch('/:id', auth(User_Role.RECRUITER), jobController.updateJob);

router.get(
    '/save-job',
    auth(User_Role.CANDIDATE),
    savedJobController.getSavedJobs
);
module.exports = router;
