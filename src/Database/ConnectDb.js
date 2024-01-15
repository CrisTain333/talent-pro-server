const mongoose = require('mongoose');
const colors = require('colors');
const config = require('../config/config');
const { logger, errorLogger } = require('../shared/logger');
const connectToDatabase = async () => {
    try {
        await mongoose.connect(config.database_url);
        logger.info('🛢 Connected To Database'.green);
    } catch (error) {
        errorLogger.error('❌ Failed to Connect Database'.red);
        errorLogger.error(error);
        process.exit(1);
    }
};

module.exports = connectToDatabase;
