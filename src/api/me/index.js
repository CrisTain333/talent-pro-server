const express = require('express');
const router = express.Router();

const auth = require('../../middleware/auth');

const applicationController = require('../../controller/application-controller');
const meController = require('../../controller/me-controller');
const jobController = require('../../controller/job-controller');
const candidateController = require('../../controller/candidate-controller');
const savedJobController = require('../../controller/save-job-controller');

const { User_Role } = require('../../constant/user-roles');
const { validateRequest } = require('../../middleware/validateRequest');
const candidateValidation = require('./candidate-validation');
const uploader = require('../../middleware/uploader');
const userValidation = require('./validation');

router.get('/', auth(), meController.getMe);
router.patch(
    '/image',
    uploader.single('profile-picture'),
    auth(),
    meController.updateProfilePicture
);

router.post(
    '/profile',
    uploader.single('resume'),
    auth(User_Role.CANDIDATE),
    // validateRequest(
    //     candidateValidation.candidateProfileSchema
    // ),
    candidateController.createCandidate
);
router.get(
    '/profile',
    auth(User_Role.CANDIDATE),
    candidateController.getCandidateProfile
);

router.patch(
    '/',
    validateRequest(userValidation.userUpdateValidation),
    auth(),
    meController.updateUser
);

// ** ---------------------- Candidate Info Routes ----------------------

router.get('/info', auth(), candidateController.getInfo);
router.patch(
    '/info',
    validateRequest(candidateValidation.candidateInfoUpdateProfileSchema),
    auth(User_Role.CANDIDATE, User_Role.SUPER_ADMIN),
    candidateController.updateInfo
);

// ** ---------------------- Candidate experience Routes ----------------------

router.get('/experience', auth(), candidateController.getExperience);

router.post('/experience', auth(), candidateController.createExperience);

router.patch(
    '/experience/:id',
    validateRequest(candidateValidation.experienceUpdateSchema),
    auth(),
    candidateController.updateExperience
);

router.delete('/experience/:id', auth(), candidateController.removeExperience);

// ** ---------------------- Candidate education Routes ----------------------

router.get('/education', auth(), candidateController.getEducation);
router.post('/education', auth(), candidateController.addEducation);

router.patch('/education/:id', auth(), candidateController.updateEducation);
router.delete('/education/:id', auth(), candidateController.removeEducation);

// ** ---------------------- Candidate skills Routes ----------------------

router.get('/skills-expertise', auth(), candidateController.getSkills);

router.patch(
    '/skills-expertise',
    auth(),
    candidateController.updateSkillExpertise
);

router.patch(
    '/resume',
    uploader.single('resume'),
    auth(),
    candidateController.updateCandidateResume
);

// ** ---------------------- Candidate Saved Job Routes ----------------------

router.post(
    '/job/saved/:id',
    auth(User_Role.CANDIDATE),
    savedJobController.saveJob
);

router.get(
    '/job/saved',
    auth(User_Role.CANDIDATE),
    savedJobController.getSavedJobs
);

router.delete(
    '/job/saved/:id',
    auth(User_Role.CANDIDATE),
    savedJobController.removeSavedJob
);

router.get(
    '/job/saved/list',
    auth(User_Role.CANDIDATE),
    savedJobController.saveJobsList
);

// ** ---------------------- Candidate Application Routes ----------------------

router.post(
    '/job/:id/apply',
    auth(User_Role.CANDIDATE),
    uploader.single('resume'),
    applicationController.applyJob
);

router.get(
    '/job/applied-job',
    auth(User_Role.CANDIDATE),
    applicationController.getAppliedJobs
);

router.get(
    '/job/applied-job/:applicationId',
    auth(User_Role.CANDIDATE),
    applicationController.getSingleApplicationForCandidate
);

// ** ---------------------- Candidate Job Routes ----------------------

router.get(
    '/job',
    auth(User_Role.CANDIDATE),
    jobController.getCandidateAllJobsList
);

router.get(
    '/job/:id',
    auth(User_Role.CANDIDATE),
    jobController.getCandidateSingleJob
);

module.exports = router;
