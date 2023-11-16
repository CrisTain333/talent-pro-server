const express = require('express');
const router = express.Router();

const authRoute = require('../api/auth/index');
const meRoute = require('../api/me/index');
const { startServer } = require('../api/server');

router.use('/auth', authRoute);
router.use('/me', meRoute);
router.use('/start', startServer);

module.exports = router;
