const mongoose = require('mongoose');
const {
    EmployStatus,
    EmploymentType,
    IndustryOptions
} = require('../constant/keyChain');

const candidateProfileSchema = new mongoose.Schema({
    candidate_id: {
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
    education: {
        institute_name: {
            type: String
        },
        degree: {
            type: String
        },
        major: {
            type: String
        },
        location: {
            type: String
        },
        start_date: {
            type: String
        },
        end_date: {
            type: String
        },
        study_currently: {
            type: Boolean
        }
    },
    experience: [
        {
            company_name: {
                type: String
            },
            designation: {
                type: String
            },
            job_type: {
                type: String
            },
            start_date: {
                type: String
            },
            end_date: {
                type: String
            },
            work_currently: {
                type: Boolean
            }
        }
    ],
    industry: {
        type: String,
        enum: IndustryOptions,
        required: true
    },
    job_status: {
        type: String,
        enum: EmployStatus,
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

    skills: {
        type: [String],
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
});

const Candidate = mongoose.model(
    'Candidate',
    candidateProfileSchema
);

module.exports = Candidate;
