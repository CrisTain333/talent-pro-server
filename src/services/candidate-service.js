const ApiError = require('../error/ApiError');
const Candidate = require('../model/candidateModel');
const User = require('../model/userModel');
const { uploadFiles } = require('../shared/uploadFile');

exports.createCandidate = async (candidateData, file) => {
    const uploadedResume = await uploadFiles(file);
    if (!uploadedResume) {
        throw ApiError(400, 'Failed to update resume');
    }
    candidateData.resume = uploadedResume[0];
    candidateData.resume_preview = uploadedResume[0];
    const result = await Candidate.create(candidateData);
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
