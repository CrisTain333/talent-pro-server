const mongoose = require('mongoose');

const candidateProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true
    },
    industry: {
        label: {
            type: String,
            required: true
        },
        value: {
            type: String,
            required: true
        }
    },
    job_status: {
        type: String,
        enum: ['EMPLOYED', 'NOT_EMPLOYED', 'STUDENT'],
        required: true
    },
    employment_type: {
        type: String,
        enum: ['FULL_TIME', 'PART_TIME', 'INTERN'],
        required: true
    },
    work_location: {
        type: String,
        required: true
    },
    work_remotely: {
        type: Boolean,
        required: true
    },
    desired_salary: {
        minimum: {
            type: Number,
            required: true
        },
        maximum: {
            type: Number,
            required: true
        }
    },
    phone: {
        type: String,
        required: true
    },
    portfolio: {
        type: String,
        required: true
    },
    resume: {
        type: String
    }
});

const Candidate = mongoose.model(
    'Candidate',
    candidateProfileSchema
);

module.exports = Candidate;
