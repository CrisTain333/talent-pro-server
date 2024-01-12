const { default: mongoose } = require('mongoose');

const applySchema = new mongoose.Schema({
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job'
    },
    candidate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Candidate'
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
                    type: String
                },

                value: {
                    type: String
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
        required: true
    }
});
