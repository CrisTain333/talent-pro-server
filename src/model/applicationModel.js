const mongoose = require('mongoose');
const {
    ExperienceLevel,
    LocationType,
    EmploymentType,
    applicationStatus
} = require('../constant/keyChain');

const applicationSchema = new mongoose.Schema(
    {
        user: {
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
            },
            address: {
                type: String,
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
            default: 'application_received',
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

// applicationSchema.pre(/^find/, function (next) {
//     this.populate({
//         path: 'user',
//         select: 'name email image_url'
//     });

//     next();
// });

const Application = mongoose.model('Application', applicationSchema);

module.exports = Application;
