const catchAsync = require('../shared/catchAsync');
const sendResponse = require('../shared/sendResponse');

const jobService = require('../services/job-service');
const pick = require('../shared/pick');
const { jobFilterableFields } = require('../constant/keyChain');
const { paginationFields } = require('../constant/pagination');

const postJob = catchAsync(async (req, res) => {
    const { ...jobData } = req.body;

    const result = await jobService.postJob(jobData);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Job posted successfully',
        data: result
    });
});

const getAllJobs = catchAsync(async (req, res) => {
    const filters = pick(req.query, jobFilterableFields);
    const paginationOptions = pick(req.query, paginationFields);
    const user = req.user;

    const result = await jobService.getAllJobs(
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

const getSingleJob = catchAsync(async (req, res) => {
    const jobId = req.params.id;
    const user = req.user;

    const result = await jobService.getSingleJob(user, jobId);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: `Job retrieved successfully`,
        data: result
    });
});

const getPublicSingleJob = catchAsync(async (req, res) => {
    const jobId = req.params.id;

    const result = await jobService.getSinglePublicJob(jobId);

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

    const result = await jobService.updateJobById(jobId, updatedData, user);
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

module.exports = {
    postJob,
    getAllJobs,
    getSingleJob,
    getPublicSingleJob,
    updateJob,
    updateJobStatus
};
