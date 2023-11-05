const mongoose = require('mongoose');
require('dotenv').config();
const colors = require('colors');
const connectToDatabase = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URI);
        console.log('🛢 Connected To Database'.yellow);
    } catch (error) {
        console.log('❌ Failed to  Connect Database'.red);
        console.error(error.message);
        process.exit(1);
    }
};

module.exports = connectToDatabase;
