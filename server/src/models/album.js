const mongoose = require("mongoose");
const albumSchema = require("../schemas/album.js");

const Album = mongoose.model("Album", albumSchema);

module.exports = Album;