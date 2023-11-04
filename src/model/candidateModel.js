const mongoose = require('mongoose');

const candidateProfileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users', // Reference to the User model
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
        enum: ['Employed', 'Not Employed', 'Student'],
        required: true
    },
    employment_type: {
        type: String,
        enum: ['Full time', 'Part-time', 'Intern'],
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
    resume: {
        type: String
    }
});

const Candidate = mongoose.model(
    'Candidates',
    candidateProfileSchema
);

module.exports = Candidate;
