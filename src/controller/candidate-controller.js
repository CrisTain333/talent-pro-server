const catchAsync = require('../shared/catchAsync');

const candidateService = require('../services/candidate-service');
const sendResponse = require('../shared/sendResponse');

const createCandidate = catchAsync(async (req, res) => {
    const { ...candidateData } = req.body;
    const resume = req.file;
    const result = await candidateService.createCandidate(
        candidateData,
        resume
    );
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Candidate created successfully',
        data: result
    });
});

const getCandidateProfile = catchAsync(async (req, res) => {
    const { _id } = req.user;
    const result = await candidateService.getCandidateProfile(_id);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Candidate fetched successfully',
        data: result
    });
});

const updateCandidateProfile = catchAsync(async (req, res) => {
    const { _id } = req.user;
    const { ...updatedData } = req.body;
    const result = await candidateService.updateCandidateProfile(
        _id,
        updatedData
    );
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Candidate profile updated successfully',
        data: result
    });
});

// ** --------------------------- Candidate Info section ----------------------
const getInfo = catchAsync(async (req, res) => {
    const { _id } = req.user;
    const result = await candidateService.getInfo(_id);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Candidate info retrieved successfully',
        data: result
    });
});

const updateInfo = catchAsync(async (req, res) => {
    const { _id } = req.user;
    const { ...userUpdatedData } = req.body;
    const result = await candidateService.updateCandidateInfo(
        _id,
        userUpdatedData
    );
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Candidate info updated successfully',
        data: result
    });
});

// ** --------------------------- Candidate Experience section ----------------------

const getExperience = catchAsync(async (req, res) => {
    const { _id } = req.user;
    const result = await candidateService.getExperience(_id);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Candidate Experience retrieved successfully',
        data: result
    });
});

const createExperience = catchAsync(async (req, res) => {
    const { _id } = req.user;
    const { ...experienceData } = req.body;
    const result = await candidateService.createExperience(_id, experienceData);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'experience added  successfully',
        data: result
    });
});
const updateExperience = catchAsync(async (req, res) => {
    const { id } = req.params;
    const { ...experienceData } = req.body;
    const result = await candidateService.updateExperience(id, experienceData);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'experience updated  successfully',
        data: result
    });
});
const removeExperience = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await candidateService.removeExperience(id);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'experience removed  successfully',
        data: result
    });
});
// ** --------------------------- Candidate Education section ----------------------

const getEducation = catchAsync(async (req, res) => {
    const { _id } = req.user;
    const result = await candidateService.getEducation(_id);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Education retrieved successfully',
        data: result
    });
});

const addEducation = catchAsync(async (req, res) => {
    const { _id } = req.user;
    const { ...educationData } = req.body;
    const result = await candidateService.createEducation(_id, educationData);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Education added successfully',
        data: result
    });
});

const updateEducation = catchAsync(async (req, res) => {
    const { id } = req.params;
    const { ...educationData } = req.body;
    const result = await candidateService.updateEducation(id, educationData);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Education updated successfully',
        data: result
    });
});
const removeEducation = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await candidateService.removeEducation(id);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Education removed successfully',
        data: result
    });
});

// ** --------------------------- Candidate skill section ----------------------

const getSkills = catchAsync(async (req, res) => {
    const { _id } = req.user;
    const result = await candidateService.get_skills_expertise(_id);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Candidate skills  retrieved successfully',
        data: result
    });
});

const updateSkillExpertise = catchAsync(async (req, res) => {
    const { _id } = req.user;
    const { ...updatedData } = req.body;
    const result = await candidateService.update_skills_expertise(
        _id,
        updatedData
    );
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Skill and expertise update successfully',
        data: result
    });
});

const updateCandidateResume = catchAsync(async (req, res) => {
    const { _id } = req.user;
    const resume = req.file;

    const result = await candidateService.updateResume(_id, resume);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Resume update successfully',
        data: result
    });
});

// ** --------------------------- Candidate Dashboard section ----------------------

const getDashboard = catchAsync(async (req, res) => {
    const { _id } = req.user;
    const result = await candidateService.getDashboard(_id);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Candidate dashboard retrieved successfully',
        data: result
    });
});

module.exports = {
    createCandidate,
    getCandidateProfile,
    updateCandidateProfile,
    getInfo,
    getExperience,
    getEducation,
    getSkills,
    updateInfo,
    createExperience,
    updateExperience,
    removeExperience,
    addEducation,
    updateEducation,
    removeEducation,
    updateCandidateResume,
    updateSkillExpertise,
    getDashboard
};
