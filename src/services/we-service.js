const ApiError = require('../error/ApiError');
const Application = require('../model/applicationModel');
const Job = require('../model/jobModel');
const Organization = require('../model/organizationModel');
const User = require('../model/userModel');
const { uploadFiles } = require('../shared/uploadFile');

exports.createOrganization = async (user, organizationData, logo) => {
    if (logo) {
        const uploadedLogoUrl = await uploadFiles(logo);
        organizationData.company_logo = uploadedLogoUrl[0];
    }

    const result = await Organization.create(organizationData);

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

    const user = await User.findById(userId);

    const org = await Organization.findOne({
        user_id: userId
    });

    if (!org)
        throw new ApiError(
            400,
            'No such organization found for user ' + user?.name?.first_name
        );

    return org;
};

// Organization dashboard section

exports.getOrganizationDashboard = async userId => {
    if (!userId)
        throw new ApiError(403, "You Don't have permission to access this.");

    const organization = await Organization.findOne({
        user_id: userId
    });

    if (!organization) throw new ApiError(400, 'No organization found');

    // total applications
    const total_applications = await Application.countDocuments({
        organization: organization?._id
    });

    // in review applications
    const in_review_applications = await Application.countDocuments({
        organization: organization?._id,
        status: 'application_in_review'
    });

    // interview scheduled applications
    const interview_scheduled_application = await Application.countDocuments({
        organization: organization?._id,
        status: 'interview_scheduled'
    });

    // interview completed applications

    const interview_completed_applications = await Application.countDocuments({
        organization: organization?._id,
        status: 'interview_completed'
    });

    // hired applications
    const hired_applications = await Application.countDocuments({
        organization: organization?._id,
        status: 'hired'
    });

    // not selected applications
    const notSelected_applications = await Application.countDocuments({
        organization: organization?._id,
        status: 'not_selected'
    });

    // total jobs
    const total_jobs = await Job.countDocuments({
        organization: organization?._id
    });

    // published jobs
    const published_jobs = await Job.countDocuments({
        organization: organization?._id,
        status: 'PUBLISHED'
    });

    // unpublished jobs
    const unpublished_jobs = await Job.countDocuments({
        organization: organization?._id,
        status: 'UNPUBLISHED'
    });

    // on hold jobs
    const on_hold_jobs = await Job.countDocuments({
        organization: organization?._id,
        status: 'ON_HOLD'
    });

    // closed jobs
    const closed_jobs = await Job.countDocuments({
        organization: organization?._id,
        status: 'CLOSED'
    });

    return {
        total_applications,
        in_review_applications,
        interview_scheduled_application,
        interview_completed_applications,
        hired_applications,
        notSelected_applications,
        total_jobs,
        published_jobs,
        unpublished_jobs,
        on_hold_jobs,
        closed_jobs
    };
};
