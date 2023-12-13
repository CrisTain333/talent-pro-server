const mongoose = require('mongoose');

const educationSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true
    },

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
});

const Education = mongoose.model(
    'education',
    educationSchema
);

module.exports = Education;
