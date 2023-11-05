const ApiError = require('../error/ApiError');
const Candidate = require('../model/candidateModel');
const User = require('../model/userModel');

exports.createCandidate = async candidateData => {
    const candidate = await Candidate.create(candidateData);

    if (candidate) {
        await User.findByIdAndUpdate(candidate?._id);
    } else {
        throw new ApiError(
            400,
            'Failed to create candidate'
        );
    }

    return candidate;
};

exports.getCandidateProfile = async userId => {
    try {
        const result = await Candidate.findOne({
            user: userId
        }).populate('user');
        return result;
    } catch (error) {
        console.error(error);
        throw new ApiError(
            400,
            'Error fetching candidate profile'
        );
    }
};
