const Candidate = require('../model/candidateModel');

exports.createCandidate = async candidateData => {
    const result = await Candidate.create(candidateData);
    return result;
};
