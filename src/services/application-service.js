const { default: mongoose } = require('mongoose');
const ApiError = require('../error/ApiError');
const Application = require('../model/applicationModel');
const Job = require('../model/jobModel');
const User = require('../model/userModel');
const { uploadFiles } = require('../shared/uploadFile');

exports.applyJob = async (userId, resume, requestedData) => {
    const jobId = requestedData.job._id;

    console.log('Checking if user already applied' + jobId);
    const job = await Job.findOne({
        applied_by: jobId
    });

    if (job) {
        console.log('Job already applied');
        console.log(job);
        throw new ApiError(400, 'You have already applied for this job');
    }
    console.log('used not  applied . . . . . ');

    console.log('uploading resume . . . . ');

    const uploadedResume = await uploadFiles(resume);
    if (!uploadedResume) {
        throw ApiError(400, 'Failed to update resume');
    }

    console.log('resume uploaded: ' + uploadedResume[0]);

    requestedData.resume = uploadedResume[0];

    const session = await mongoose.startSession();

    try {
        session.startTransaction();
        console.log('applying to job . . . . ');

        const newlyAppliedData = await Application.create(requestedData, {
            session
        });
        if (!newlyAppliedData) {
            console.log('failed to create application');
            throw new ApiError(400, 'Failed to create application');
        }

        console.log('updating job state . . . .');

        const updateJObState = await Job.findByIdAndUpdate(
            newlyAppliedData.job,
            {
                $inc: { total_applications: 1 },
                $push: { applied_by: userId }
            },
            {
                new: true,
                session
            }
        );

        if (!updateJObState) {
            console.log('failed to update job state');
            throw new ApiError(400, 'failed to update job state');
        }
        console.log('job state updated');

        console.log('applied to job successfully');

        await session.commitTransaction();
        await session.endSession();
    } catch (error) {
        await session.abortTransaction();
        await session.endSession();
        throw error;
    } finally {
        await session.endSession();
    }

    const application = await Application.findOne({
        user: userId,
        'job.id': requestedData.job.id
    });

    application.populate('user candidate organizations');

    return application;
};
