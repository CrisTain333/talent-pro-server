const express = require('express');
const router = express.Router();

const jobController = require('../../controller/job-controller');
const auth = require('../../middleware/auth');
const { User_Role } = require('../../constant/user-roles');
const savedJobController = require('../../controller/save-job-controller');

router.get(
    '/save-job',
    auth(User_Role.CANDIDATE),
    savedJobController.getSavedJobs
);

router.post(
    '/save-job/:id',
    auth(User_Role.CANDIDATE),
    savedJobController.saveJob
);

router.get(
    '/save-job-list',
    auth(User_Role.CANDIDATE),
    savedJobController.saveJobsList
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

router.delete(
    '/save-job/:id',
    auth(User_Role.CANDIDATE),
    savedJobController.removeSavedJob
);

module.exports = router;
