const express = require('express');
const router = express.Router();

const authRoute = require('../api/auth/index');
const meRoute = require('../api/me/index');
const weRoute = require('../api/we/index');
const jobRoute = require('../api/job/index');
const { startServer } = require('../api/server');
const applyJob = require('../api/job-apply/index');

router.use('/auth', authRoute);
router.use('/me', meRoute);
router.use('/we', weRoute);
router.use('/job', jobRoute);
router.use('/start', startServer);
router.use('/apply-job', applyJob);

module.exports = router;
