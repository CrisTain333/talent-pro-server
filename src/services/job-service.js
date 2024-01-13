const {
    jobSearchableFields,
    allowedFieldsToUpdateJob
} = require('../constant/keyChain');
const ApiError = require('../error/ApiError');
const calculatePagination = require('../helper/paginationHelper');
const Job = require('../model/jobModel');
const calculateWorkingHours = require('../utils/calculateWorkingsHours');

exports.postJob = async jobData => {
    const result = await Job.create(jobData);
    return result;
};

exports.getAllJobs = async (filters, paginationOptions, user) => {
    const { search, ...filtersData } = filters;
    const { page, limit, skip, sortBy, sortOrder } =
        calculatePagination(paginationOptions);

    const andConditions = [];

    // Search needs $or for searching in specified fields
    if (search) {
        andConditions.push({
            $or: jobSearchableFields.map(field => ({
                [field]: {
                    $regex: search,
                    $options: 'i'
                }
            }))
        });
    }

    // Filters needs $and to fulfill all the conditions
    if (Object.keys(filtersData).length) {
        andConditions.push({
            $and: Object.entries(filtersData).map(([field, value]) => ({
                [field]: value
            }))
        });
    }

    // Add condition based on user role
    if (user.role === 'candidate') {
        andConditions.push({
            $or: [{ status: 'PUBLISHED' }, { status: 'ON_HOLD' }]
        });
    }

    // Dynamic Sort needs field to do sorting
    const sortConditions = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }

    const whereConditions =
        andConditions.length > 0 ? { $and: andConditions } : {};

    const result = await Job.find(whereConditions)
        .populate({
            path: 'createdBy',
            select: '_id name image_url email'
        })
        .populate({
            path: 'organization',
            select: '_id company_logo company_name'
        })
        .select(
            'job_title job_type experience_level location_type address status total_views total_applications createdAt'
        )
        .sort(sortConditions)
        .skip(skip)
        .limit(limit);

    const total = await Job.countDocuments(whereConditions);

    return {
        meta: {
            page,
            limit,
            total
        },
        data: result
    };
};

exports.getSingleJob = async (user, jobID) => {
    const job = await Job.findOne({ _id: jobID })
        .populate({
            path: 'createdBy',
            select: '_id name image_url email'
        })
        .populate({
            path: 'organization',
            select: '_id company_logo company_name about_us industry company_location company_size website'
        })
        .select(
            'job_title job_description required_skills years_of_experience start_day end_day deadline num_of_vacancy working_hours job_type experience_level location_type address status salary createdAt viewed_by start_time end_time total_views'
        );

    if (!job) {
        throw new ApiError(400, 'Invalid job ID');
    }

    if (!job.viewed_by.includes(user._id) && user.role === 'candidate') {
        job.total_views = +job.total_views + 1;
        job.viewed_by.push(user._id);
        await job.save();
    }

    const startTime = job.start_time;
    const endTime = job.end_time;

    const totalWorkingHours = calculateWorkingHours(startTime, endTime);
    const result = job.toObject();
    result.working_hours = totalWorkingHours;

    return result;
};

exports.getSinglePublicJob = async jobID => {
    const job = await Job.findOne({ _id: jobID })
        .populate({
            path: 'createdBy',
            select: '_id name image_url email'
        })
        .populate({
            path: 'organization',
            select: '_id company_logo company_name about_us industry company_location company_size website'
        })
        .select(
            'job_title job_description required_skills years_of_experience start_day end_day deadline num_of_vacancy start_time end_time working_hours job_type experience_level location_type address status salary createdAt'
        );

    if (!job) {
        throw new ApiError(400, 'Invalid job ID');
    }

    const startTime = job.start_time;
    const endTime = job.end_time;

    const totalWorkingHours = calculateWorkingHours(startTime, endTime);
    const result = job.toObject();
    result.working_hours = totalWorkingHours;

    return result;
};

exports.updateJobById = async (jobID, updatedFields, user) => {
    const job = await Job.findById(jobID)?.populate('createdBy');

    if (!job || job === null) {
        throw new ApiError(404, 'Job not found');
    }

    if (job.createdBy?._id.toString() !== user?._id.toString()) {
        throw new ApiError(403, `you don't have permission to update`);
    }

    if (job.total_application > 0) {
        throw new ApiError(
            403,
            'Job has received applications and cannot be updated'
        );
    }

    const fieldsToUpdate = {};

    for (const field in updatedFields) {
        if (allowedFieldsToUpdateJob.includes(field)) {
            fieldsToUpdate[field] = updatedFields[field];
        }
    }

    const result = await Job.findByIdAndUpdate(jobID, fieldsToUpdate, {
        new: true
    })
        .populate('createdBy')
        .populate('organization');

    if (!result)
        throw new ApiError(400, 'Invalid job ID or no fields to update');

    return result;
};

exports.updateJobStatus = async (jobID, user, status) => {
    const job = await Job.findById(jobID)?.populate('createdBy');

    if (!job || job === null) {
        throw new ApiError(404, 'Job not found');
    }

    if (job.createdBy?._id.toString() !== user?._id.toString()) {
        throw new ApiError(403, `you don't have permission to update`);
    }
    const updatedJb = await Job.findByIdAndUpdate(jobID, status, { new: true });

    return updatedJb;
};
