const express = require('express');
const router = express.Router();

const meController = require('../../controller/me-controller');
const candidateController = require('../../controller/candidate-controller');
const auth = require('../../middleware/auth');
const {
    validateRequest
} = require('../../middleware/validateRequest');
const userValidation = require('./validation');
const candidateValidation = require('./candidate-validation');
const { User_Role } = require('../../constant/user-roles');
const uploader = require('../../middleware/uploader');

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
    validateRequest(
        candidateValidation.candidateInfoUpdateProfileSchema
    ),
    auth(User_Role.CANDIDATE, User_Role.SUPER_ADMIN),
    candidateController.updateInfo
);

// ** ---------------------- Candidate experience Routes ----------------------

router.get(
    '/experience',
    auth(),
    candidateController.getExperience
);

router.post(
    '/experience',
    auth(),
    candidateController.createExperience
);

router.patch(
    '/experience/:id',
    validateRequest(
        candidateValidation.experienceUpdateSchema
    ),
    auth(),
    candidateController.updateExperience
);

router.delete(
    '/experience/:id',
    auth(),
    candidateController.removeExperience
);

// ** ---------------------- Candidate education Routes ----------------------

router.get(
    '/education',
    auth(),
    candidateController.getEducation
);
router.post(
    '/education',
    auth(),
    candidateController.addEducation
);

router.patch(
    '/education/:id',
    auth(),
    candidateController.updateEducation
);
router.delete(
    '/education/:id',
    auth(),
    candidateController.removeEducation
);

// ** ---------------------- Candidate skills Routes ----------------------

router.get(
    '/skills-expertise',
    auth(),
    candidateController.getSkills
);

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

module.exports = router;
