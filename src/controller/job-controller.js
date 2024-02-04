const pick = require('../shared/pick');
const catchAsync = require('../shared/catchAsync');
const sendResponse = require('../shared/sendResponse');

const { jobFilterableFields } = require('../constant/keyChain');
const { paginationFields } = require('../constant/pagination');

const jobService = require('../services/job-service');

// Candidate Job Routes

const getGlobalJobsList = catchAsync(async (req, res) => {
    const filters = pick(req.query, jobFilterableFields);
    const paginationOptions = pick(req.query, paginationFields);
    const user = req.user;

    const result = await jobService.getGlobalJobsList(
        filters,
        paginationOptions,
        user
    );

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: `Job's retrieved successfully`,
        data: result.data,
        meta: result.meta
    });
});

const getCandidateSingleJob = catchAsync(async (req, res) => {
    const jobId = req.params.id;
    const user = req.user;

    const result = await jobService.getCandidateSingleJob(user, jobId);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: `Job retrieved successfully`,
        data: result
    });
});

// Candidate Saved Job Routes

module.exports = {
    getGlobalJobsList,
    getCandidateSingleJob
};
