const catchAsync = require('../shared/catchAsync');
const applicationService = require('../services/application-service');
const sendResponse = require('../shared/sendResponse');
const { paginationFields } = require('../constant/pagination');
const pick = require('../shared/pick');
const { appliedJobFilterableField } = require('../constant/keyChain');

const applyJob = catchAsync(async (req, res) => {
    const { _id } = req.user;
    const applicationData = req.body;
    const jobId = req.params.id;
    const resume = req.file;

    const result = await applicationService.applyJob(
        _id,
        jobId,
        resume,
        applicationData
    );
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Applied to job successfully',
        data: result
    });
});

const getAppliedJobs = catchAsync(async (req, res) => {
    const { _id } = req.user;
    const paginationOptions = pick(req.query, paginationFields);
    const filters = pick(req.query, appliedJobFilterableField);

    const result = await applicationService.getAppliedJobs(
        _id,
        paginationOptions,
        filters
    );

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: `Applied job's retrieved successfully`,
        data: result.data,
        meta: result.meta
    });
});

const getSingleApplicationForCandidate = catchAsync(async (req, res) => {
    const { applicationId } = req.params;
    const user = req.user;

    const result = await applicationService.getSingleApplicationForCandidate(
        applicationId,
        user
    );
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Application retrieved successfully',
        data: result
    });
});

const getApplicationByOrganization = catchAsync(async (req, res) => {
    const { _id } = req.user;
    const paginationOptions = pick(req.query, paginationFields);
    const filters = pick(req.query, appliedJobFilterableField);

    const result = await applicationService.getApplicationByOrganization(
        _id,
        paginationOptions,
        filters
    );

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Applications retrieved successfully',
        data: result.data,
        meta: result.meta
    });
});

const getApplicationByJob = catchAsync(async (req, res) => {
    const { jobId } = req.params;

    const paginationOptions = pick(req.query, paginationFields);
    const filters = pick(req.query, appliedJobFilterableField);

    const result = await applicationService.getApplicationByJob(
        jobId,
        paginationOptions,
        filters
    );
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Applications retrieved successfully',
        data: result.data,
        meta: result.meta
    });
});

const getSingleApplication = catchAsync(async (req, res) => {
    const { jobId, applicationId } = req.params;
    const user = req.user;

    const result = await applicationService.getSingleApplication(
        jobId,
        applicationId,
        user
    );
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Application retrieved successfully',
        data: result
    });
});

module.exports = {
    applyJob,
    getAppliedJobs,
    getSingleApplicationForCandidate,
    getApplicationByOrganization,
    getApplicationByJob,
    getSingleApplication
};
