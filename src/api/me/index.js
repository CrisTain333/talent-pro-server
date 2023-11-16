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
    '/update-profile-picture',
    uploader.single('profile-picture'),
    auth(),
    meController.updateProfilePicture
);

router.post(
    '/profile',
    uploader.single('resume'),
    auth(User_Role.CANDIDATE),
    validateRequest(
        candidateValidation.candidateProfileSchema
    ),
    candidateController.createCandidate
);
router.get(
    '/profile',
    auth(User_Role.CANDIDATE),
    candidateController.getCandidateProfile
);

router.patch(
    '/profile',
    auth(User_Role.CANDIDATE),
    validateRequest(
        candidateValidation.updateCandidateProfileSchema
    ),
    candidateController.updateCandidateProfile
);

router.patch(
    '/',
    validateRequest(userValidation.userUpdateValidation),
    auth(),
    meController.updateUser
);

module.exports = router;
