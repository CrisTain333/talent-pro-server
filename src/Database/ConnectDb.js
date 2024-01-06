const mongoose = require('mongoose');
const colors = require('colors');
const config = require('../config/config');
const connectToDatabase = async () => {
    try {
        console.log(`Database connection url ${config.database_url}`);
        await mongoose.connect(config.database_url);
        console.log('🛢 Connected To Database'.green);
    } catch (error) {
        console.log('❌ Failed to Connect Database'.red);
        console.error(error);
        process.exit(1);
    }
};

module.exports = connectToDatabase;
