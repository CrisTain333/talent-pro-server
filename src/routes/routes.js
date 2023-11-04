const express = require('express');
const router = express.Router();

const authRoute = require('../api/auth/index');
const meRoute = require('../api/me/index');
router.use('/auth', authRoute);
router.use('/me', meRoute);

module.exports = router;
