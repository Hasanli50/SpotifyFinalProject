const mongoose = require("mongoose");
const trackSchema = require("../schemas/track.js");

const Track = mongoose.model("Track", trackSchema);

module.exports = Track;