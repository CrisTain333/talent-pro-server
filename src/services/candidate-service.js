const Candidate = require('../model/candidateModel');
const User = require('../model/userModel');

exports.createCandidate = async candidateData => {
    const result = await Candidate.create(candidateData);
    return result;
};

exports.getCandidateProfile = async userId => {
    const result =
        await Candidate.findById(userId).populate('userId');
    return result;
};
