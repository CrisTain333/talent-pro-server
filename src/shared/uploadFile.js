const cloudinary = require('cloudinary').v2;
require('dotenv').config();
// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});
console.log(process.env.CLOUD_NAME);
console.log(process.env.CLOUD_API_KEY);
console.log(process.env.CLOUD_API_SECRET);

async function uploadFiles(file) {
    console.log(file);

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
