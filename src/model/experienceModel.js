const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', // Reference to the User model
            required: true
        },
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
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true
        }
    }
);

const Experience = mongoose.model(
    'experience',
    experienceSchema
);

module.exports = Experience;
