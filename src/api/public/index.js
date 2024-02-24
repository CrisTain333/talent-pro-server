const express = require('express');
const router = express.Router();
const jobController = require('../../controller/job-controller');

router.get('/job/:id', jobController.getPublicSingleJob);

module.exports = router;
