const mongoose = require('mongoose');
const { EmployStatus, IndustryOptions } = require('../constant/keyChain');

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
                required: true
            },
            max: {
                type: Number,
                required: true
            }
        },
        industry: {
            type: String,
            enum: IndustryOptions,
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
            type: String,
            required: true
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
