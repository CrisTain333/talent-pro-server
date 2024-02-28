const mongoose = require('mongoose');
const {
    EmployStatus,
    IndustryOptions,
    GenderOption
} = require('../constant/keyChain');

const candidateProfileSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', // Reference to the User model
            required: true
        },
        desired_salary: {
            min: {
                type: Number,
                default: 0
            },
            max: {
                type: Number,
                default: 0
            }
        },
        industry: {
            type: String,
            enum: IndustryOptions,
            required: true
        },
        gender: {
            type: String,
            enum: GenderOption,
            required: true
        },
        date_of_birth: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        },
        location: {
            type: String,
            required: true
        },

        job_status: {
            type: String,
            enum: EmployStatus,
            required: true
        },

        skills: {
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
        portfolio: {
            type: String
        },
        resume: {
            type: String,
            required: true
        },

        open_to_work_remotely: {
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

const Candidate = mongoose.model('Candidate', candidateProfileSchema);

module.exports = Candidate;
