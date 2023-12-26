// import multer from 'multer';
const multer = require('multer');
const ApiError = require('../error/ApiError');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './src/uploads/');
    },
    filename: (req, file, cb) => {
        const fileName = Date.now() + '_' + file.originalname;
        file.originalname = fileName;
        cb(null, fileName);
    }
});

const uploader = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 10 // 10 MB max
    },
    fileFilter: (req, file, cb) => {
        if (file.fieldname === 'resume') {
            if (file.mimetype === 'application/pdf') {
                cb(null, true);
            } else {
                cb(new ApiError(400, 'only .pdf formate are allowed'));
            }
        }
        if (
            file.fieldname === 'profile-picture' ||
            file.fieldname === 'company_logo'
        ) {
            if (
                file.mimetype === 'image/jpg' ||
                file.mimetype === 'image/jpeg' ||
                file.mimetype === 'image/png'
            ) {
                cb(null, true);
            } else {
                cb(
                    new ApiError(
                        400,
                        'only .jpg .jpeg .png formate  are allowed'
                    )
                );
            }
        }
    }
});

module.exports = uploader;
