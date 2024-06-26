const pick = require('../shared/pick');
const catchAsync = require('../shared/catchAsync');
const sendResponse = require('../shared/sendResponse');

const { jobFilterableFields } = require('../constant/keyChain');
const { paginationFields } = require('../constant/pagination');

const jobService = require('../services/job-service');

// Candidate Job Routes

const getCandidateAllJobsList = catchAsync(async (req, res) => {
    const filters = pick(req.query, jobFilterableFields);
    const paginationOptions = pick(req.query, paginationFields);
    const user = req.user;

    const result = await jobService.getCandidateAllJobsList(
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

// Recruiter Job Routes

const createNewJob = catchAsync(async (req, res) => {
    const { ...jobData } = req.body;

    const result = await jobService.createNewJob(jobData);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Job posted successfully',
        data: result
    });
});

const getRecruiterJobList = catchAsync(async (req, res) => {
    const filters = pick(req.query, jobFilterableFields);
    const paginationOptions = pick(req.query, paginationFields);
    const user = req.user;

    const result = await jobService.getRecruiterJobList(
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

const getRecruiterSingleJob = catchAsync(async (req, res) => {
    const jobId = req.params.id;

    const result = await jobService.getRecruiterSingleJob(jobId);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: `Job retrieved successfully`,
        data: result
    });
});

const updateJob = catchAsync(async (req, res) => {
    const user = req.user;
    const jobId = req.params.id;
    const updatedData = req.body;

    const result = await jobService.updateJob(jobId, updatedData, user);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Job updated successfully',
        data: result
    });
});

const updateJobStatus = catchAsync(async (req, res) => {
    const user = req.user;
    const jobId = req.params.id;
    const status = req.body;

    const result = await jobService.updateJobStatus(jobId, user, status);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Job status updated successfully',
        data: result
    });
});

// Public Job Routes

const getPublicSingleJob = catchAsync(async (req, res) => {
    const jobId = req.params.id;

    const result = await jobService.getPublicSingleJob(jobId);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: `Job retrieved successfully`,
        data: result
    });
});

const deleteJob = catchAsync(async (req, res) => {
    const jobId = req.params.id;

    const result = await jobService.deleteJob(jobId);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: `Job deleted successfully`,
        data: result
    });
});

module.exports = {
    getCandidateAllJobsList,
    getCandidateSingleJob,
    createNewJob,
    getRecruiterJobList,
    getRecruiterSingleJob,
    updateJob,
    updateJobStatus,
    getPublicSingleJob,
    deleteJob
};
