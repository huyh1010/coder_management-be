const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    role: { type: String, enum: ["manager", "employee"], default: "employee" },
    tasks: { type: Array },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
