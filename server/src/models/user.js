const mongoose = require("mongoose");
const userSchema = require("../schemas/user.js");

const User = mongoose.model("User", userSchema);

module.exports = User;