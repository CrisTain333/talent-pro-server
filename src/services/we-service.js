const ApiError = require('../error/ApiError');
const Organization = require('../model/organizationModel');
const { uploadFiles } = require('../shared/uploadFile');

exports.createOrganization = async (
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

    return result;
};
