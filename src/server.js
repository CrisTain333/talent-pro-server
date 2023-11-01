const mongoose = require("mongoose");
const app = require("./app");
const connectToDatabase = require("./Database/ConnectDb");
require("dotenv").config();

const port = process.env.PORT || 5000;
const uri = process.env.DATABASE_URI;

connectToDatabase();

app.listen(port, () => {
  console.log(`Application listening on port ${port}`);
});
