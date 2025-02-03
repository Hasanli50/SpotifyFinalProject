const mongoose = require("mongoose");
const artistSchema = require("../schemas/artist.js");

const Artist = mongoose.model("Artist", artistSchema);

module.exports = Artist;