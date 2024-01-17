const catchAsync = require('../shared/catchAsync');
const applicationService = require('../services/application-service');
const sendResponse = require('../shared/sendResponse');
const { paginationFields } = require('../constant/pagination');
const pick = require('../shared/pick');
const { appliedJobFilterableField } = require('../constant/keyChain');

const applyJobController = catchAsync(async (req, res) => {
    const { _id } = req.user;
    const applicationData = req.body;
    const resume = req.file;
    const result = await applicationService.applyJob(
        _id,
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

const getAppliedJob = catchAsync(async (req, res) => {
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
        message: `applied job's retrieved successfully`,
        data: result.data,
        meta: result.meta
    });
});

module.exports = {
    applyJobController,
    getAppliedJob
};
