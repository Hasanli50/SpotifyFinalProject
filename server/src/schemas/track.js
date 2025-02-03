const mongoose = require("mongoose");
const { Schema } = mongoose;

const trackSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    artistId: {
      type: Schema.Types.ObjectId,
      ref: "Artist",
      required: true,
    },
    albumId: {
      type: Schema.Types.ObjectId,
      ref: "Album", 
      default: null,
    },
    durationMs: {
      type: Number,
      required: true,
    },
    explicit: {
      type: Boolean,
      default: false,
    },
    previewUrl: {
      type: String,
      required: true,
    },
    playCount: {
      type: Number,
      default: 0,
    },
    releaseDate: {
      type: Date,
      required: true,
    },
    genreId: {
      type: Schema.Types.ObjectId,
      ref: "Genre",
      required: true,
    },
    type: {
      type: String,
      enum: ["album", "single"],
      required: true,
    },
    coverImage: {
      type: String,
      required: true,
    },
    collaborated_artistIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "Artist",
      },
    ],
    premiumOnly: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true } 
);

module.exports = trackSchema;
