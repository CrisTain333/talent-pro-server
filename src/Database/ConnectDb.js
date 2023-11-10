const mongoose = require('mongoose');
const colors = require('colors');
const config = require('../config/config');
const connectToDatabase = async () => {
    try {
        await mongoose.connect(config.database_url);
        console.log('🛢 Connected To Database'.green);
    } catch (error) {
        console.log('❌ Failed to  Connect Database'.red);
        console.error(error.message);
        process.exit(1);
    }
};

module.exports = connectToDatabase;
