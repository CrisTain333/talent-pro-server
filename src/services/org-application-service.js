const { default: mongoose, Mongoose } = require('mongoose');
const Application = require('../model/applicationModel');

exports.getApplicationByOrg = async userId => {
    const allApplications = await Application.find({}).populate('organization');
    const finalData = allApplications.filter(a => {
        return a.organization.user_id.equals(
            new mongoose.Types.ObjectId(userId)
        );
    });
    return finalData;
};

exports.getApplicationByJob = async JobId => {
    const allApplications = await Application.find({ 'job._id': JobId });
    return allApplications;
};

exports.getSingleApplication = async (JobId, applicationId) => {
    console.log(applicationId);

    const singleApplication = await Application.findOne({
        _id: applicationId
    }).populate('user candidate organization');
    return singleApplication;
};
