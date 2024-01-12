const mongoose = require('mongoose');
const {
    ExperienceLevel,
    LocationType,
    EmploymentType,
    applicationStatus
} = require('../constant/keyChain');

const applicationSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', // Reference to the User model
            required: true
        },
        candidate: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Candidate', // Reference to the Candidate model
            required: true
        },
        organization: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Organization', // Reference to the Organization model
            required: true
        },
        job: {
            _id: {
                type: mongoose.Schema.Types.ObjectId,
                required: true
            },
            job_title: {
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
            location_type: {
                type: String,
                enum: LocationType,
                required: true
            }
        },
        phone: {
            type: String,
            required: true
        },
        years_of_experience: {
            type: Number,
            required: true
        },
        skills: {
            type: [
                {
                    label: {
                        type: String,
                        required: true
                    },

                    value: {
                        type: String,
                        required: true
                    }
                }
            ],
            required: true
        },
        resume: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: applicationStatus,
            default: 'Application Received',
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

const Application = mongoose.model('Application', applicationSchema);

module.exports = Application;
