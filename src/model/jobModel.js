const mongoose = require('mongoose');
const {
    EmployStatus,
    ExperienceLevel,
    LocationType,
    WeekDay,
    EmploymentType
} = require('../constant/keyChain');

const jobSchema = new mongoose.Schema(
    {
        recruiter_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', // Reference to the User model
            required: true
        },
        organization_id: {
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
        }
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
