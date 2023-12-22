const mongoose = require('mongoose');
const { IndustryOptions } = require('../constant/keyChain');

const recruiterSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true
    },
    company_name: {
        type: String,
        required: true
    },
    industry: {
        type: String,
        enum: IndustryOptions,
        required: true
    },
    company_size: {
        type: String,
        required: true
    },
    company_location: {
        type: String,
        required: true
    },
    company_logo: {
        type: String
    },
    website: {
        type: String,
        required: true
    },
    linkedin_link: {
        type: String
    },
    slogan: {
        type: String,
        required: true
    },
    about_us: {
        type: String,
        required: true
    }
});

const Recruiter = mongoose.model(
    'recruiter',
    recruiterSchema
);

module.exports = Recruiter;

// user_Id: string reference [User Id],
// Company_name: string,
// Industry: {label: string, value: string},
// company_size: string,
// comapny_location: string,
// company_logo: string,
// website:string,
// Linkidin_link:string
// slogan:string,
// About_us:string,
