const mongoose = require("mongoose");
const app = require("./app");
const colors = require("colors");
const connectToDatabase = require("./Database/ConnectDb");
require("dotenv").config();

const port = process.env.PORT || 5000;

connectToDatabase();

app.listen(port, () => {
  console.log(
    `Server running on  http://localhost:${port}`.cyan
  );
});