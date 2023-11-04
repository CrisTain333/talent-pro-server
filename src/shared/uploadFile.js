// /* eslint-disable @typescript-eslint/no-explicit-any */
// import multer from 'multer';

// const storage = multer.diskStorage({
//     destination: (req: any, file: any, cb: any) => {
//         cb(null, './src/uploads/');
//     },
//     filename: (req: any, file: any, cb: any) => {
//         const fileName = Date.now() + '_' + file.originalname;
//         file.originalname = fileName;
//         cb(null, fileName);
//     }
// });

// export const uploadSystem = multer({
//     storage: storage,
//     limits: {
//         fileSize: 1024 * 1024 * 5 // 5 MB
//     },
//     fileFilter: (req: any, file: any, cb: any) => {
//         if (
//             file.fieldname === 'images' ||
//             file.fieldname === 'banner' ||
//             file.fieldname === 'shopProfile' ||
//             file.fieldname === 'profilePicture'
//         ) {
//             if (
//                 file.mimetype === 'image/jpg' ||
//                 file.mimetype === 'image/jpeg' ||
//                 file.mimetype === 'image/png'
//             ) {
//                 cb(null, true);
//             } else {
//                 cb(new Error('only .jpg .jpeg .png  are allowed'));
//             }
//         }
//     }
// });

// // module.exports = newUploadSystem;
