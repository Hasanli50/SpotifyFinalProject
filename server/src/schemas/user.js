const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcrypt");

const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
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
      enum: ["admin", "user"],
      default: "user",
    },
    followers: {
      type: Number,
      default: 0,
    },
    following: {
      type: Number,
      default: 0,
    },
    playlistCount: {
      type: Number,
      default: 0,
    },
    image: {
      type: String,
      required: true,
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
    subscriptionExpiryDate: {
      type: Date,

      validate: {
        validator: function (value) {
          if (this.isPremium && !value) {
            return false;
          }
          if (this.isPremium && value && value < Date.now()) {
            return false;
          }
          return true;
        },
        message: "Subscription expiry date is required for premium users",
      },
    },
    collaboratedUserId: {
      type: [Schema.Types.ObjectId],
      ref: "User",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    try {
      this.password = await bcrypt.hash(this.password, 10);
    } catch (error) {
      return next(error);
    }
  }
  next();
});

module.exports = userSchema;
