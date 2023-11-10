const config = require('../config/config');

const cloudinary = require('cloudinary').v2;
require('dotenv').config();
// Configuration
cloudinary.config({
    cloud_name: config.cloudy_nary.cloud_name,
    api_key: config.cloudy_nary.cloud_api_key,
    api_secret: config.cloudy_nary.cloud_api_secret
});

async function uploadFiles(file) {
    try {
        const uploadResults = [];

        // Loop through the files and upload each one
        // for (const file of files) {
        if (file?.fieldname === 'profile-picture') {
            const uploadResult =
                await cloudinary.uploader.upload(
                    file.path,
                    {
                        folder: 'Talent-Pro/profile-pictures'
                    }
                );
            uploadResults.push(uploadResult.secure_url);
        } else if (file?.fieldname === 'resume') {
            const uploadResult =
                await cloudinary.uploader.upload(
                    file.path,
                    {
                        folder: 'Talent-Pro/documents'
                    }
                );
            uploadResults.push(uploadResult.secure_url);
        }
        // }

        return uploadResults;
    } catch (error) {
        console.error('Error uploading files:', error);
        throw error;
    }
}

module.exports = { uploadFiles };
