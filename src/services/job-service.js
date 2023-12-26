const { jobSearchableFields } = require('../constant/keyChain');
const ApiError = require('../error/ApiError');
const calculatePagination = require('../helper/paginationHelper');
const Job = require('../model/jobModel');

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

exports.getSingleJob = async jobID => {
    const result = await Job.findOne({ _id: jobID })
        .populate('createdBy')
        .populate('organization');

    if (!result) throw new ApiError(400, 'Invalid job ID');
    return result;
};
