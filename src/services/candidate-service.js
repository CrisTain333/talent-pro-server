const ApiError = require('../error/ApiError');
const Candidate = require('../model/candidateModel');
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
        candidateData.resume = uploadedResume[0];
        candidateData.resume_preview = uploadedResume[0];
        const result =
            await Candidate.create(candidateData);
        if (!result) {
            throw ApiError(
                400,
                'Failed to setup candidate profile'
            );
        }
        await User.findByIdAndUpdate(
            result?.candidate_id,
            {
                isOnboardComplete: true
            },
            {
                new: true
            }
        );

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
    // i have a new experience as a object now i want to add it to the experience array

    console.log(new_experience_data);

    const data = await Candidate.findOneAndUpdate(
        { candidate_id: userId },
        {
            $push: {
                experience: new_experience_data
            }
        },
        { new: true }
    );

    if (!data)
        throw new ApiError(400, 'failed to add experience');

    return data;
};

// ** --------------------------- Candidate education section ----------------------

exports.getEducation = async userId => {
    const candidate = await Candidate.findOne({
        candidate_id: userId
    });
    const customizedData = {
        education: candidate?.education
    };
    return customizedData;
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
