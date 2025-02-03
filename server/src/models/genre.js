const mongoose = require("mongoose");
const genreSchema = require("../schemas/genre.js");

const Genre = mongoose.model("Genre", genreSchema);

module.exports = Genre;