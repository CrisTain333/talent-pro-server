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
            const experienceDataArray = candidateData.experience.map(exp => ({
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
            const educationDataArray = candidateData.education.map(edu => ({
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

        let resultData = await Candidate.create([candidateData], { session });

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
};

exports.getCandidateProfile = async userId => {
    const result = await Candidate.findOne({
        user_id: userId
    }).populate('user_id');

    if (!result || result === null) {
        throw new ApiError(400, 'Error fetching candidate profile');
    }
    return result;
};

exports.updateCandidateProfile = async (userId, candidateUpdatedData) => {
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
    }).select('-_id gender date_of_birth phone location industry job_status');

    return candidate;
};

exports.updateCandidateInfo = async (userID, candidateInfo) => {
    const { gender, date_of_birth, phone, location, industry, job_status } =
        candidateInfo;
    await Candidate.findOneAndUpdate(
        { user_id: userID },
        { gender, date_of_birth, phone, location, industry, job_status },
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
    const experienceData = {
        experience
    };

    return experienceData;
};

exports.createExperience = async (userId, new_experience_data) => {
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

    if (!data) throw new ApiError(400, 'failed to add experience');

    return data;
};

exports.updateExperience = async (experienceId, updatedExperience) => {
    const result = await Experience.updateOne(
        {
            _id: experienceId
        },
        updatedExperience,
        { new: true }
    );

    if (!result) {
        throw new ApiError(400, 'Failed to update experience');
    }

    return result;
};
exports.removeExperience = async experienceId => {
    const data = await Experience.findByIdAndDelete(experienceId);

    if (!data) {
        throw new ApiError(400, 'Failed to remove experience');
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

exports.createEducation = async (userId, new_education_data) => {
    const {
        institute_name,
        degree,
        major,
        location,
        start_date,
        end_date,
        study_currently
    } = new_education_data;

    const educationData = {
        user_id: userId,
        institute_name,
        degree,
        major,
        location,
        start_date,
        end_date,
        study_currently
    };

    const data = await Education.create(educationData);

    if (!data) throw new ApiError(400, 'failed to add education');
    return data;
};

exports.updateEducation = async (educationId, education) => {
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
        throw new ApiError(400, 'Failed to update education');
    }

    return data;
};

exports.removeEducation = async educationID => {
    const data = await Education.findByIdAndDelete({
        _id: educationID
    });

    if (!data) {
        throw new ApiError(400, 'Failed to remove education');
    }

    return data;
};

// ** --------------------------- Candidate skill section ----------------------

exports.get_skills_expertise = async userId => {
    const candidate = await Candidate.findOne({
        user_id: userId
    }).select(
        '-_id skills portfolio resume desired_salary open_to_work_remotely'
    );

    return candidate;
};

exports.update_skills_expertise = async (userId, updatedData) => {
    const data = await Candidate.findOneAndUpdate(
        {
            user_id: userId
        },
        {
            skills: updatedData?.skills,
            portfolio: updatedData?.portfolio,
            desired_salary: {
                min: updatedData?.desired_salary?.min,
                max: updatedData?.desired_salary?.max
            },
            open_to_work_remotely: updatedData?.open_to_work_remotely
        },
        {
            new: true
        }
    );

    if (!data) {
        throw new ApiError(400, 'Failed to update skill and expertise');
    }

    return data;
};

exports.updateResume = async (userId, resume) => {
    const uploadedResume = await uploadFiles(resume);
    if (!uploadedResume) {
        throw ApiError(400, 'Failed to update resume');
    }

    const data = await Candidate.findOneAndUpdate(
        {
            user_id: userId
        },
        {
            resume: uploadedResume[0],
            resume_preview: uploadedResume[0]
        },
        {
            new: true
        }
    );

    if (!data) {
        throw new ApiError(400, 'Failed to update resume');
    }

    return data;
};
