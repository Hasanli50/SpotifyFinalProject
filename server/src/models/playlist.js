const mongoose = require("mongoose");
const playlistSchema = require("../schemas/playlist.js");

const Playlist = mongoose.model("Playlist", playlistSchema);

module.exports = Playlist;