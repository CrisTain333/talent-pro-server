const express = require('express');
const router = express.Router();

const jobController = require('../../controller/job-controller');
const auth = require('../../middleware/auth');
const { User_Role } = require('../../constant/user-roles');

router.post(
    '/',
    auth(User_Role.RECRUITER, User_Role.SUPER_ADMIN),
    jobController.postJob
);

router.get('/', jobController.getAllJobs);

// TODO
/* 
Create get all job and single;
GET - ALL Jobs
Search by job title
sort by createdAt
Filter With Job_Type,Location_Type -> ,experience_level,




 */

module.exports = router;
