const Job = require('../model/jobModel');

const {
    jobSearchableFields,
    allowedFieldsToUpdateJob
} = require('../constant/keyChain');

const ApiError = require('../error/ApiError');

const calculatePagination = require('../helper/paginationHelper');
const calculateWorkingHours = require('../utils/calculateWorkingsHours');
const { User_Role } = require('../constant/user-roles');
const { default: mongoose } = require('mongoose');
const Application = require('../model/applicationModel');
const SavedJob = require('../model/saveJobModel');

exports.getCandidateAllJobsList = async (filters, paginationOptions, user) => {
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

    andConditions.push({
        $or: [{ status: 'PUBLISHED' }, { status: 'ON_HOLD' }]
    });

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
            'job_title job_type experience_level location_type address status total_views total_applications applied_by createdAt'
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

exports.getCandidateSingleJob = async (user, jobID) => {
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
            'job_title job_description required_skills years_of_experience start_day end_day deadline num_of_vacancy working_hours job_type experience_level location_type address status salary createdAt viewed_by applied_by start_time end_time total_views'
        );

    if (!job) {
        throw new ApiError(400, 'Invalid job ID');
    }

    if (!job.viewed_by.includes(user._id)) {
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

exports.createNewJob = async jobData => {
    const result = await Job.create(jobData);
    return result;
};

exports.getRecruiterJobList = async (filters, paginationOptions, user) => {
    const { search, ...filtersData } = filters;
    const { page, limit, skip, sortBy, sortOrder } =
        calculatePagination(paginationOptions);

    const andConditions = [];

    andConditions.push({
        createdBy: user._id
    });

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
            'job_title job_type experience_level location_type address status total_views total_applications applied_by createdAt'
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

exports.getRecruiterSingleJob = async jobID => {
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
            'job_title job_description required_skills years_of_experience start_day end_day deadline num_of_vacancy working_hours job_type experience_level location_type address status salary createdAt viewed_by applied_by start_time end_time total_views total_applications is_negotiable'
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

exports.updateJob = async (jobID, updatedFields, user) => {
    const job = await Job.findById(jobID)?.populate('createdBy');

    if (!job || job === null) {
        throw new ApiError(404, 'Job not found');
    }

    if (job.createdBy?._id.toString() !== user?._id.toString()) {
        throw new ApiError(403, `You don't have permission to update`);
    }

    if (job.total_applications > 0) {
        throw new ApiError(
            403,
            `Job has received applications and can't be updated`
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
    const job = await Job.findById(jobID).populate('createdBy');

    if (!job) {
        throw new ApiError(404, 'Job not found');
    }

    if (
        job.createdBy._id.toString() === user._id.toString() ||
        user.role === User_Role.SUPER_ADMIN
    ) {
        const updatedJob = await Job.findByIdAndUpdate(jobID, status, {
            new: true
        });
        return updatedJob;
    } else {
        throw new ApiError(403, `You don't have permission to update`);
    }
};

exports.getPublicSingleJob = async jobID => {
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

exports.deleteJob = async JobId => {
    if (!JobId) throw new ApiError(400, 'Invalid job ID');

    const job = await Job.findById(JobId);

    if (!job) {
        throw new ApiError(404, 'Job not found');
    }

    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        // Delete Job from Job collection
        await Job.deleteOne(
            { _id: JobId },
            {
                session
            }
        );

        // Delete application applied to this job
        await Application.deleteMany(
            { 'job._id': JobId },
            {
                session
            }
        );

        // Delete Job from Saved Job collection

        await SavedJob.deleteMany(
            { job: JobId },
            {
                session
            }
        );

        await session.commitTransaction();
        await session.endSession();
    } catch (error) {
        await session.abortTransaction();
        await session.endSession();
        throw error;
    } finally {
        await session.endSession();
    }
};
