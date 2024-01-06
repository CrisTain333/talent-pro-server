const { default: mongoose } = require('mongoose');

const savedJobSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', // Reference to the User model
            required: true
        },
        job: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Job', // Reference to the Job model
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

const SavedJob = mongoose.model('Saved-Job', savedJobSchema);
