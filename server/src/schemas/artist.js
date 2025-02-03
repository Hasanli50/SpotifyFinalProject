const mongoose = require("mongoose");
const { Schema } = mongoose;

const artistSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      default: "artist",
      enum: ["artist"],
    },
    genreIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "Genre",
      },
    ],
    followers: {
      type: Number,
      default: 0,
    },
    albums_count: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    image: {
      type: String,
      required: true,
    },
    trackIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "Track",
      },
    ],
    albumIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "Album",
      },
    ],
    social_media: {
      instagram: {
        type: String,
        match: [
          /^https:\/\/(www\.)?instagram\.com\/[A-Za-z0-9_-]+/,
          "Please enter a valid Instagram URL",
        ],
      },
      twitter: {
        type: String,
        match: [
          /^https:\/\/(www\.)?twitter\.com\/[A-Za-z0-9_-]+/,
          "Please enter a valid Twitter URL",
        ],
      },
      facebook: {
        type: String,
        match: [
          /^https:\/\/(www\.)?facebook\.com\/[A-Za-z0-9_-]+/,
          "Please enter a valid Facebook URL",
        ],
      },
    },
  },
  { timestamps: true }
);

module.exports = artistSchema;
