const Job = require('../model/jobModel');

exports.postJob = async jobData => {
    const result = await Job.create(jobData);
    return result;
};

exports.getAllJobs = async () => {};
