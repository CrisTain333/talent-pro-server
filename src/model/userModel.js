const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      first_name: {
        type: String,
        required: true,
      },
      last_name: {
        type: String,
        required: true,
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["candidate", "recruiter", "super_admin"],
      default: "candidate",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("Users", userSchema);

module.exports = User;
