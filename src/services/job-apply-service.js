const { default: mongoose } = require('mongoose');
const ApplyJob = require('../model/applyModal');
const Job = require('../model/jobModel');
const { uploadFiles } = require('../shared/uploadFile');
const ApiError = require('../error/ApiError');

exports.applyJob = async (requestedData, user, file) => {
    console.log(requestedData, user);

    const uploadedResume = await uploadFiles(file);
    if (!uploadedResume) {
        throw ApiError(400, 'Failed to update resume');
    }

    requestedData.resume = uploadedResume[0];

    let { job, candidate, phone, years_of_experience, skills, resume, status } =
        requestedData;

    const session = await mongoose.startSession();
    try {
        session.startTransaction();

        const applied = await ApplyJob.create(
            {
                phone: phone,
                resume: resume,
                status: status,
                job: job,
                candidate: candidate,
                years_of_experience: years_of_experience,
                skills: skills
            },
            {
                session
            }
        );
        console.log('Applied Job: ' + applied.job);

        console.log('job updating . . . . . ');
        // Correct the variable name to use 'applied._id'
        const updatedJob = await Job.findByIdAndUpdate(
            job,
            {
                $inc: { total_applications: 1 },
                $push: { applied_by: user._id }
            },
            {
                new: true,
                session: session
            }
        );

        console.log('Job Updated . . . . ');
        console.log(updatedJob);
    } catch (error) {
        await session.abortTransaction();
        await session.endSession();
        throw error;
    } finally {
        await session.endSession();
    }
};
