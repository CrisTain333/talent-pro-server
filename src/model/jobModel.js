const mongoose = require('mongoose');
const {
    ExperienceLevel,
    LocationType,
    WeekDay,
    EmploymentType,
    IndustryOptions,
    JobStatus
} = require('../constant/keyChain');

const jobSchema = new mongoose.Schema(
    {
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', // Reference to the User model
            required: true
        },
        organization: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Organization', // Reference to the Organization model
            required: true
        },
        job_title: {
            type: String,
            required: true
        },
        job_description: {
            type: String,
            required: true
        },
        industry: {
            type: String,
            enum: IndustryOptions,
            required: true
        },
        job_type: {
            type: String,
            enum: EmploymentType,
            required: true
        },
        experience_level: {
            type: String,
            enum: ExperienceLevel,
            required: true
        },
        required_skills: {
            type: [
                {
                    label: {
                        type: String
                    },

                    value: {
                        type: String
                    }
                }
            ],
            required: true
        },
        years_of_experience: {
            type: Number,
            required: true
        },
        location_type: {
            type: String,
            enum: LocationType,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        start_day: {
            type: String,
            enum: WeekDay,
            required: true
        },
        end_day: {
            type: String,
            enum: WeekDay,
            required: true
        },
        start_time: {
            type: String,
            required: true
        },
        end_time: {
            type: String,
            required: true
        },
        deadline: {
            type: String,
            required: true
        },
        num_of_vacancy: {
            type: Number,
            required: true
        },
        salary: {
            min: {
                type: Number,
                required: true
            },
            max: {
                type: Number,
                required: true
            }
        },
        is_negotiable: {
            type: Boolean,
            required: true
        },
        status: {
            type: String,
            enum: JobStatus,
            default: 'PUBLISHED',
            required: true
        },
        total_application: {
            type: Number,
            default: 0,
            required: true
        },

        views: { type: Number, default: 0 },

        viewedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true
        }
    }
);

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
