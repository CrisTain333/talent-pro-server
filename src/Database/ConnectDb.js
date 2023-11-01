const mongoose = require("mongoose");
require("dotenv").config();
// const colors = require("colors");
const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URI);
    console.log("🛢 Connected To Database ");
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

module.exports = connectToDatabase;
