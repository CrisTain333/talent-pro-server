const { default: mongoose } = require('mongoose');
const ApiError = require('../error/ApiError');
const Candidate = require('../model/candidateModel');
const Experience = require('../model/experienceModel');
const User = require('../model/userModel');
const { uploadFiles } = require('../shared/uploadFile');
const Education = require('../model/educationModel');

exports.createCandidate = async (candidateData, file) => {
    let newData;
    const uploadedResume = await uploadFiles(file);
    if (!uploadedResume) {
        throw ApiError(400, 'Failed to update resume');
    }

    // ** upload the resume and set to the object
    candidateData.resume = uploadedResume[0];
    candidateData.resume_preview = uploadedResume[0];

    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        if (
            Array.isArray(candidateData?.experience) &&
            candidateData?.experience?.length > 0
        ) {
            console.log('inside experience');
            const experienceDataArray =
                candidateData.experience.map(exp => ({
                    user_id: candidateData?.user_id,
                    company_name: exp.company_name,
                    designation: exp.designation,
                    job_type: exp.job_type,
                    start_date: exp.start_date,
                    end_date: exp.end_date,
                    work_currently: exp.work_currently
                }));

            await Experience.create(experienceDataArray, {
                session
            });
        }

        if (
            Array.isArray(candidateData?.education) &&
            candidateData?.education?.length > 0
        ) {
            console.log('education');
            const educationDataArray =
                candidateData.education.map(edu => ({
                    user_id: candidateData?.user_id,
                    institute_name: edu.institute_name,
                    degree: edu.degree,
                    major: edu.major,
                    location: edu.location,
                    start_date: edu.start_date,
                    end_date: edu.end_date,
                    study_currently: edu.study_currently
                }));

            await Education.create(educationDataArray, {
                session
            });
        }

        let resultData = await Candidate.create(
            [candidateData],
            { session }
        );

        if (resultData) {
            newData = resultData;
        }

        await User.findByIdAndUpdate(
            resultData[0]?.user_id,
            {
                isOnboardComplete: true
            },
            {
                new: true,
                session
            }
        );

        await session.commitTransaction();
        await session.endSession();
    } catch (error) {
        console.log(error);
        await session.abortTransaction();
        await session.endSession();
        throw error;
    } finally {
        await session.endSession();
    }

    // const education =  await Ed

    const experience = await Experience.find({
        user_id: candidateData?.user_id
    });

    const education = await Education.find({
        user_id: candidateData?.user_id
    });
    const result = {
        experience,
        education,
        candidate: newData[0]
    };

    return result;

    // return candidateData;
};

exports.getCandidateProfile = async userId => {
    console.log(userId);
    const result = await Candidate.findOne({
        user: userId
    })
        .select('-__v')
        .populate('user', '-__v -password');

    console.log(result);

    if (!result || result === null) {
        throw new ApiError(
            400,
            'Error fetching candidate profile'
        );
    }
    return result;
};

exports.updateCandidateProfile = async (
    userId,
    candidateUpdatedData
) => {
    if (!userId) {
        throw new ApiError(400, 'User Id is required');
    } else if (!candidateUpdatedData) {
        throw new ApiError(400, 'Data is required');
    }

    await Candidate.updateOne(
        {
            user: userId
        },
        candidateUpdatedData,
        {
            new: true
        }
    );

    const result = await Candidate.findOne({
        user: userId
    });

    return result;
};

// ** --------------------------- Candidate Info section ----------------------

exports.getInfo = async userId => {
    const candidate = await Candidate.findOne({
        user_id: userId
    }).select('phone location -_id industry job_status');

    return candidate;
};

exports.updateCandidateInfo = async (
    userID,
    candidateInfo
) => {
    const { phone, location, industry, job_status } =
        candidateInfo;
    await Candidate.findOneAndUpdate(
        { user_id: userID },
        {
            phone,
            location,
            industry,
            job_status
        },
        { new: true }
    );

    const candidate = await Candidate.findOne({
        user_id: userID
    }).select('phone location -_id industry job_status');

    return candidate;
};

// ** --------------------------- Candidate experience section ----------------------

exports.getExperience = async userId => {
    const experience = await Experience.find({
        user_id: userId
    });
    const customizedData = {
        experience
    };

    return customizedData;
};

exports.createExperience = async (
    userId,
    new_experience_data
) => {
    const {
        company_name,
        designation,
        job_type,
        start_date,
        end_date,
        work_currently
    } = new_experience_data;

    const experienceData = {
        user_id: userId,
        company_name,
        designation,
        job_type,
        start_date,
        end_date,
        work_currently
    };

    const data = await Experience.create(experienceData);

    if (!data)
        throw new ApiError(400, 'failed to add experience');

    return data;
};

exports.updateExperience = async (
    userId,
    experienceId,
    updatedExperience
) => {
    const result = await Experience.updateOne(
        {
            _id: experienceId
        },
        updatedExperience,
        { new: true }
    );

    if (!result) {
        throw new ApiError(
            400,
            'Failed to update experience'
        );
    }

    return updatedExperience;
};
exports.removeExperience = async (userId, experienceId) => {
    const data =
        await Experience.findByIdAndDelete(experienceId);

    if (!data) {
        throw new ApiError(
            400,
            'Failed to remove experience'
        );
    }

    return data;
};

// ** --------------------------- Candidate education section ----------------------

exports.getEducation = async userId => {
    const education = await Education.find({
        user_id: userId
    });
    const educationData = {
        education
    };

    return educationData;
};

exports.createEducation = async new_education_data => {
    const data = await Education.create(new_education_data);

    if (!data)
        throw new ApiError(400, 'failed to add education');
    return data;
};

exports.updateEducation = async (
    userId,
    education,
    educationId
) => {
    const data = await Education.findByIdAndUpdate(
        {
            _id: educationId
        },
        education,
        {
            new: true
        }
    );

    if (!data) {
        throw new ApiError(
            400,
            'Failed to update education'
        );
    }

    return data;
};

exports.removeEducation = async educationID => {
    const data = await Education.findByIdAndDelete({
        _id: educationID
    });

    if (!data) {
        throw new ApiError(
            400,
            'Failed to remove education'
        );
    }

    return data;
};

// ** --------------------------- Candidate skill section ----------------------

exports.get_skills_expertise = async userId => {
    const candidate = await Candidate.findOne({
        user_id: userId
    });

    const customizedData = {
        skills: candidate?.skills,
        portfolio: candidate?.portfolio,
        resume: candidate?.resume,
        desired_salary: candidate?.desired_salary,
        open_to_work_remotely:
            candidate?.open_to_work_remotely
    };

    return customizedData;
};
