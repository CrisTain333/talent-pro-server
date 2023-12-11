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
    '/experience/add',
    auth(),
    candidateController.createExperience
);

router.patch(
    '/experience/update',
    auth(),
    candidateController.updateExperience
);

router.delete(
    '/experience/remove',
    auth(),
    candidateController.removeExperience
);

// ** ---------------------- Candidate education Routes ----------------------

router.get(
    '/education',
    auth(),
    candidateController.getEducation
);

// ** ---------------------- Candidate skills Routes ----------------------

router.get(
    '/skills-expertise',
    auth(),
    candidateController.getSkills
);

module.exports = router;
