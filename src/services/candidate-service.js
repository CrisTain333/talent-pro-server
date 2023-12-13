const ApiError = require('../error/ApiError');
const Candidate = require('../model/candidateModel');
const Experience = require('../model/experienceModel');
const User = require('../model/userModel');
const { uploadFiles } = require('../shared/uploadFile');

exports.createCandidate = async (candidateData, file) => {
    console.log(`Candidate-Data : ${candidateData}`);
    console.log(`Candidate-Resume : ${file}`);
    try {
        const uploadedResume = await uploadFiles(file);
        if (!uploadedResume) {
            throw ApiError(400, 'Failed to update resume');
        }

        // ** upload the resume and set to the object
        candidateData.resume = uploadedResume[0];
        candidateData.resume_preview = uploadedResume[0];

        // ** Create experience first;
        const {
            company_name,
            designation,
            job_type,
            start_date,
            end_date,
            work_currently
        } = candidateData.experience;

        const experienceData = {
            user_id: candidateData?.candidate_id,
            company_name,
            designation,
            job_type,
            start_date,
            end_date,
            work_currently
        };

        await Experience.create(experienceData);
        const experience = await Experience.find({
            user_id: candidateData?.candidate_id
        });

        let resultData =
            await Candidate.create(candidateData);
        if (!resultData) {
            throw ApiError(
                400,
                'Failed to setup candidate profile'
            );
        }
        await User.findByIdAndUpdate(
            resultData?.candidate_id,
            {
                isOnboardComplete: true
            },
            {
                new: true
            }
        );

        const result = {
            experience,
            ...resultData
        };
        return result;
    } catch (error) {
        console.log(error);
        throw new ApiError(
            400,
            error?.message || 'Failed to create candidate'
        );
    }
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
        candidate_id: userId
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
        { candidate_id: userID },
        {
            phone,
            location,
            industry,
            job_status
        },
        { new: true }
    );

    const candidate = await Candidate.findOne({
        candidate_id: userID
    }).select('phone location -_id industry job_status');

    return candidate;
};

// ** --------------------------- Candidate experience section ----------------------

exports.getExperience = async userId => {
    const candidate = await Candidate.findOne({
        candidate_id: userId
    });
    const customizedData = {
        experience: candidate?.experience
    };

    return customizedData;
};

exports.createExperience = async (
    userId,
    new_experience_data
) => {
    const data = await Candidate.findOneAndUpdate(
        { candidate_id: userId },
        {
            $push: {
                experience: new_experience_data
            }
        },
        { new: true }
    ).select('experience -_id');

    if (!data)
        throw new ApiError(400, 'failed to add experience');

    return data;
};

exports.updateExperience = async (
    userId,
    experienceId,
    updatedExperience
) => {
    const result = await Candidate.updateOne(
        {
            candidate_id: userId,
            'experience._id': experienceId
        },
        {
            $set: {
                'experience.$': updatedExperience
            }
        }
    );

    if (result.nModified === 0) {
        throw new ApiError(
            400,
            'Failed to update experience'
        );
    }

    return updatedExperience;
};
exports.removeExperience = async (userId, experienceId) => {
    const data = await Candidate.findOneAndUpdate(
        {
            candidate_id: userId
        },
        {
            $pull: {
                experience: { _id: experienceId }
            }
        },
        { new: true }
    ).select('experience -_id');

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
    const candidate = await Candidate.findOne({
        candidate_id: userId
    }).select('-_id education');
    return candidate;
};

exports.createEducation = async (
    userId,
    new_education_data
) => {
    const data = await Candidate.findOneAndUpdate(
        { candidate_id: userId },
        {
            $push: {
                education: new_education_data
            }
        },
        { new: true }
    ).select('education -_id');

    if (!data)
        throw new ApiError(400, 'failed to add education');

    return data;
};

// ! Need  to fix Updated api;

exports.updateEducation = async (userId, education) => {
    const {
        company_name,
        designation,
        job_type,
        start_date,
        end_date,
        work_currently
    } = education;
    const data = await Candidate.findOneAndUpdate(
        {
            candidate_id: userId,
            'education._id': education?._id
        },
        {
            $set: {
                'education.$': {
                    company_name,
                    designation,
                    job_type,
                    start_date,
                    end_date,
                    work_currently
                }
            }
        },
        { new: true }
    ).select('education -_id');

    if (!data) {
        throw new ApiError(
            400,
            'Failed to update education'
        );
    }

    return data;
};

exports.removeEducation = async (userId, education) => {
    const data = await Candidate.findOneAndUpdate(
        {
            candidate_id: userId
        },
        {
            $pull: {
                education: { _id: education?._id }
            }
        },
        { new: true }
    ).select('education -_id');

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
        candidate_id: userId
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
