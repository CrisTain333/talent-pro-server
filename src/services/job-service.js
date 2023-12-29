const {
    jobSearchableFields,
    allowedFieldsToUpdateJob
} = require('../constant/keyChain');
const ApiError = require('../error/ApiError');
const calculatePagination = require('../helper/paginationHelper');
const Job = require('../model/jobModel');
const calculateWorkingHours = require('../utils/calculateWorkingsHours');
const checkAccess = require('../utils/checkAccess');

exports.postJob = async jobData => {
    const result = await Job.create(jobData);
    return result;
};

exports.getAllJobs = async (filters, paginationOptions) => {
    const { search, ...filtersData } = filters;
    const { page, limit, skip, sort_by, sort_order } =
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

    // Dynamic  Sort needs  field to  do sorting
    const sortConditions = {};
    if (sort_by && sort_order) {
        sortConditions[sort_by] = sort_order;
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
            'job_title job_type experience_level location_type address status total_view total_application createdAt'
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
        .populate('createdBy')
        .populate('organization');

    if (!job) {
        throw new ApiError(400, 'Invalid job ID');
    }

    if (!job.viewedBy.includes(user._id)) {
        job.views += 1;
        job.viewedBy.push(user._id);
        await job.save();
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
