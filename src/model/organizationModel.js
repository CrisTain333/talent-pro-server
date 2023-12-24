const mongoose = require('mongoose');
const { IndustryOptions } = require('../constant/keyChain');

const organizationSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
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
        type: String,
        default:
            'https://res.cloudinary.com/talent-pro/image/upload/v1703379624/organization_placeholder.png'
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

const Organization = mongoose.model(
    'organization',
    organizationSchema
);

module.exports = Organization;
