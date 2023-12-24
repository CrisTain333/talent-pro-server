const ApiError = require('../error/ApiError');
const Organization = require('../model/organizationModel');
const User = require('../model/userModel');
const { uploadFiles } = require('../shared/uploadFile');

exports.createOrganization = async (
    user,
    organizationData,
    logo
) => {
    if (logo) {
        const uploadedLogoUrl = await uploadFiles(logo);
        organizationData.company_logo = uploadedLogoUrl[0];
    }

    const result = await Organization.create(
        organizationData
    );

    await User.findByIdAndUpdate(
        user?._id,
        {
            isOnboardComplete: true
        },
        { new: true }
    );

    return result;
};

exports.getOrganization = async userId => {
    if (!userId) throw new Error('user id is required');

    const org = await Organization.findOne({
        user_id: userId
    });

    return org;
};
