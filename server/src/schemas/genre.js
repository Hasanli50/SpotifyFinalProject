const mongoose = require("mongoose");
const { Schema } = mongoose;

const genreSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

module.exports = genreSchema;
