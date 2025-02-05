const mongoose = require("mongoose");
const { Schema } = mongoose;

const albumSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    artistId: {
      type: Schema.Types.ObjectId,
      ref: "Artist",
      required: true,
    },
    trackCount: {
      type: Number,
      default: 0,
    },
    trackIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "Track",
      },
    ],
    coverImage: {
      type: String,
      required: true,
    },
    monthlyPlayCount: {
      type: Number,
      default: 0,
    },
    explicit: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = albumSchema;
