const ApiError = require('../error/ApiError');
const Candidate = require('../model/candidateModel');

exports.createCandidate = async candidateData => {
    const candidate = await Candidate.create(candidateData);
    return candidate;
};

exports.getCandidateProfile = async userId => {
    const result = await Candidate.findOne({
        user: userId
    }).populate('user');

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
    console.log(userId);
    console.log(candidateUpdatedData);

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

    console.log(result);

    return result;
};
