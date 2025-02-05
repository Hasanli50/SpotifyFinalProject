const mongoose = require("mongoose");
const { Schema } = mongoose;
require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const artistSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
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
    status: {
      type: String,
      default: "pending",
    },
    isFrozen: {
      type: Boolean,
      default: false,
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
    banExpiresAt: {
      type: Date,
      default: null,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

artistSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    try {
      this.password = await bcrypt.hash(this.password, 10);
    } catch (error) {
      return next(error);
    }
  }
  next();
});

// Static method for login
artistSchema.statics.login = async function (username, password) {
  const artist = await this.findOne({ username });
  if (!artist) {
    throw new Error("User not found");
  }
  const isMatch = await bcrypt.compare(password, artist.password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }
  return artist;
};

// Instance method to generate JWT
artistSchema.methods.generateToken = function () {
  const payload = { id: this._id, role: this.role };
  const secret = process.env.JWT_SECRET || "default_secret_key";
  const options = { expiresIn: "6h" };
  return jwt.sign(payload, secret, options);
};

artistSchema.statics.decodeToken = function (token) {
  const secret = process.env.JWT_SECRET || "default";
  const decoded = jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      return err;
    }
    return decoded;
  });

  return decoded;
};

module.exports = artistSchema;
