const mongoose = require("mongoose");
const { Schema } = mongoose;

const playlistSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    collaborators: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    trackIds: [
      {
        trackId: {
          type: Schema.Types.ObjectId,
          refPath: "trackType",
        },
        type: {
          type: String,
          enum: ["album", "single"],
          required: true,
        },
      },
    ],
    isMix: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Virtual field to dynamically reference the 'Track' or 'Single' model based on the 'type' of track
playlistSchema.virtual("trackType").get(function () {
  return this.trackIds[0]?.type === "album" ? "Track" : "Single";
});

module.exports = playlistSchema;
