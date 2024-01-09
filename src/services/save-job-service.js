const { default: mongoose } = require('mongoose');
// const {
//     jobSearchableFields,
//     savedJobSearchableFields
// } = require('../constant/keyChain');
const ApiError = require('../error/ApiError');
const calculatePagination = require('../helper/paginationHelper');
const SavedJob = require('../model/saveJobModel');
const { savedJobSearchableFields } = require('../constant/keyChain');

exports.saveJobs = async (userId, jobId) => {
    if (!userId || !jobId) {
        throw new ApiError(400, 'User Id or Job Id is required');
    }

    const isJobAllReadyExists = await SavedJob.findOne({
        job: jobId,
        user: userId
    });

    if (isJobAllReadyExists) {
        throw new ApiError(400, 'Job is already saved');
    }

    await SavedJob.create({
        user: userId,
        job: jobId
    });

    const newlySavedJob = await SavedJob.find({
        user: userId,
        job: jobId
    });
    return newlySavedJob;
};

exports.getSavedJobs = async (userId, filters, paginationOptions) => {
    if (!userId) {
        throw new ApiError(400, 'User Id is required');
    }

    const { search, ...otherFilters } = filters;
    const { page, limit, skip, sortBy, sortOrder } =
        calculatePagination(paginationOptions);

    const andConditions = [
        {
            user: new mongoose.Types.ObjectId(userId)
        }
    ];

    // Search needs $or for searching in specified fields
    if (search && savedJobSearchableFields.length > 0) {
        andConditions.push({
            $or: savedJobSearchableFields.map(field => ({
                [field]: {
                    $regex: search,
                    $options: 'i'
                }
            }))
        });
    }

    // Other filterable fields
    if (Object.keys(otherFilters).length > 0) {
        andConditions.push({
            $and: Object.entries(otherFilters).map(([field, value]) => ({
                [field]: value
            }))
        });
    }

    // Dynamic Sort needs field to do sorting
    const sortConditions = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder.toLowerCase() === 'asc' ? 1 : -1;
    }

    const whereConditions =
        andConditions.length > 0 ? { $and: andConditions } : {};

    console.log('MongoDB Query:', JSON.stringify(whereConditions, null, 2));

    console.log('Searchable Fields:', savedJobSearchableFields);

    const savedJobs = await SavedJob.find(whereConditions)
        .populate({
            path: 'job',
            populate: {
                path: 'organization',
                select: '_id company_logo company_name',
                model: 'Organization'
            },
            select: '_id organization job_title job_type experience_level location_type address createdAt'
        })
        .select('_id job')
        .sort(sortConditions)
        .skip(skip)
        .limit(limit);

    const total = await SavedJob.countDocuments(whereConditions);

    return {
        meta: {
            page,
            limit,
            total
        },
        data: savedJobs
    };
};

exports.saveJobsList = async userId => {
    if (!userId) {
        throw new ApiError(400, 'User Id is required');
    }
    const savedJobsList = await SavedJob.find({
        user: userId
    })
        .populate({
            path: 'job',
            select: '_id'
        })
        .select('job');
    return savedJobsList;
};

exports.removeSavedJob = async (userId, jobId) => {
    if (!userId || !jobId) {
        throw new ApiError(400, 'User Id or Job Id is required');
    }

    const result = await SavedJob.findOneAndDelete({
        job: jobId,
        user: userId
    });

    return result;
};
