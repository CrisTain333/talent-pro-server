const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cors = require("cors");

const app = express();

dotenv.config();
// All Parsers
app.use(express.json());
app.use(
  bodyParser.urlencoded({ extended: true, limit: "50mb" })
);
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Morgan setup
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use("/", (req, res) => {
  res.json({
    status: 200,
    message: "Talent Pro Server Is Running",
  });
});

module.exports = app;
