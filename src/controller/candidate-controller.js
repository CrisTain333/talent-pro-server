const catchAsync = require('../shared/catchAsync');

const candidateService = require('../services/candidate-service');
const sendResponse = require('../shared/sendResponse');

const createCandidate = catchAsync(async (req, res) => {
    const { ...candidateData } = req.body;
    console.log(candidateData);
    const result =
        await candidateService.createCandidate(
            candidateData
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
    const result =
        await candidateService.getCandidateProfile(_id);
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Candidate fetched successfully',
        data: result
    });
});

module.exports = { createCandidate, getCandidateProfile };