const mongoose = require("mongoose");
const { Schema } = mongoose;
require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new Schema(
  {
    username: {
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
    // followers: {
    //   type: Number,
    //   default: 0,
    // },
    following: {
      type: [Schema.Types.ObjectId],
      ref: "Artist",
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
    premiumSince: {
      type: Date,
      default: null,
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

// Static method for login
userSchema.statics.login = async function (username, password) {
  const user = await this.findOne({ username });
  if (!user) {
    throw new Error("User not found");
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }
  return user;
};

// Instance method to generate JWT
userSchema.methods.generateToken = function () {
  const payload = { id: this._id, role: this.role };
  const secret = process.env.JWT_SECRET || "default_secret_key";
  const options = { expiresIn: "6h" };
  return jwt.sign(payload, secret, options);
};

userSchema.statics.decodeToken = function (token) {
  const secret = process.env.JWT_SECRET || "default";
  const decoded = jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      return err;
    }
    return decoded;
  });

  return decoded;
};

module.exports = userSchema;
