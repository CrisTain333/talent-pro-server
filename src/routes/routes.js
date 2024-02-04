const express = require('express');
const router = express.Router();

const authRoute = require('../api/auth/index');
const meRoute = require('../api/me/index');
const weRoute = require('../api/we/index');
const { startServer } = require('../api/server');
const applicationRoute = require('../api/application/index');
router.use('/auth', authRoute);
router.use('/me', meRoute);
router.use('/we', weRoute);
router.use('/start', startServer);
router.use('/application', applicationRoute);

module.exports = router;
