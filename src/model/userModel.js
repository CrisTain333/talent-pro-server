const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        name: {
            first_name: {
                type: String,
                required: true
            },
            last_name: {
                type: String,
                required: true
            }
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        role: {
            type: String,
            enum: ['candidate', 'recruiter', 'super_admin'],
            default: 'candidate',
            required: true
        },
        account_status: {
            type: String,
            enum: ['active', 'suspended'],
            default: 'active',
            required: true
        },
        isOnboardComplete: {
            type: Boolean,
            default: false,
            required: true
        },
        image_url: {
            type: String,
            default:
                'https://i.ibb.co/WDySPnz/profile-picture.jpg'
        }
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true
        }
    }
);

const User = mongoose.model('User', userSchema);

module.exports = User;

// ! Don't Delete this commits
// ,
//         candidate: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: 'Candidate' // Reference to the User model
//         },
//         recruiter : {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: 'recruiter' // Reference to the User model
//         }
