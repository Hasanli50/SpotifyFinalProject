const transporter = require("../config/nodemailer.js");
const User = require("../models/user.js");
const formatObj = require("../utils/formatObj.js");
const path = require("path");
const bcrypt = require("bcrypt");
const extractPublicId = require("../utils/extractPublicId.js");
const { cloudinary } = require("../config/imageCloudinary.js");

  const getAllNonDeletedUsers = async (_, res) => {
    try {
      const users = await User.find({ isDeleted: false }, { password: 0 });
      if (users.length === 0) {
        return res.status(404).json({
          message: "Users not found",
          status: "fail",
        });
      }
      res.status(200).json({
        message: "Users successfully found",
        status: "success",
        data: users.map(formatObj),
      });
    } catch (error) {
      res.status(500).json({
        message: error?.message || "Internal server error",
        status: "fail",
      });
    }
  };

const getAllDeletedUsers = async (_, res) => {
  try {
    const users = await User.find({ isDeleted: true }, { password: 0 });
    if (users.length === 0) {
      return res.status(404).json({
        message: "No deleted users found",
        status: "fail",
      });
    }
    res.status(200).json({
      message: "Deleted users successfully found",
      status: "success",
      data: users.map(formatObj),
    });
  } catch (error) {
    res.status(500).json({
      message: error?.message || "Internal server error",
      status: "fail",
    });
  }
};

const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id, { isDeleted: false }).select(
      "-password"
    );
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        status: "fail",
      });
    }
    res.status(200).json({
      message: "User successfully found",
      status: "success",
      data: formatObj(user),
    });
  } catch (error) {
    res.status(500).json({
      message: error?.message || "Internal server error",
      status: "fail",
    });
  }
};

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const duplicate = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (duplicate) {
      return res.status(400).json({
        message: "Username or email already exists!",
        status: "fail",
      });
    }

    const newUser = new User({
      username,
      email,
      password,
      role: "user",
      image: req.file.path,
      isBanned: false,
      isFrozen: false,
      banExpiresAt: null,
      isDeleted: false,
    });

    await newUser.save();

    const token = newUser.generateToken();
    //send mail with nodemailer
    await transporter
      .sendMail({
        from: process.env.MAIL_USER,
        to: email,
        subject: "Account Verification | Melodies",
        html: `<h1>Click <a href="${process.env.APP_BASE_URL}/verify/${token}">here</a> to verify your account</h1>`,
      })
      .catch((error) => {
        console.log("error: ", error);
      });

    res.status(201).json({
      message: "User registered successfully. Please verify your email!",
      status: "success",
      data: {
        id: formatObj(newUser).id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        image: req.file.path,
        token: token,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error?.message || "Internal server error",
      status: "fail",
    });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.login(username, password);
    if (!user) {
      return res.status(401).json({
        message: "Invalid username or password",
        status: "fail",
      });
    }
    if (user.isVerified === false) {
      return res.status(401).json({
        message: "Please verify your account",
        status: "fail",
      });
    }

    //check if ban is expired
    if (user.banExpiresAt < Date.now()) {
      await User.findByIdAndUpdate(user._id, {
        isBanned: false,
        banExpiresAt: null,
      });
    }
    if (user.isBanned === true) {
      const remainingMilliseconds = user.banExpiresAt - Date.now();
      const remainingMinutes = Math.floor(remainingMilliseconds / (1000 * 60));
      const remainingSeconds = Math.floor(
        (remainingMilliseconds % (1000 * 60)) / 1000
      );
      return res.status(401).json({
        message: `Your account is banned. Come back after ${remainingMinutes} minutes and ${remainingSeconds} seconds.`,
        status: "fail",
      });
    }
    //check if frozen - unfreeze in login
    if (user.isFrozen === true) {
      await User.findByIdAndUpdate(user._id, { isFrozen: false });
    }

    res.status(200).json({
      data: {
        id: formatObj(user).id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      token: user.generateToken(), // generate token
      message: "User logged in successfully",
      status: "success",
    });
  } catch (error) {
    res.status(500).json({
      message: error?.message || "Internal server error",
      status: "fail",
    });
  }
};

const verifyAccount = async (req, res) => {
  try {
    const { token } = req.params;
    const { id } = User.decodeToken(token);

    if (!token) {
      return res.status(400).json({
        message: "Token is required",
        status: "fail",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(id, { isVerified: true });
    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
        status: "fail",
      });
    }

    if (updatedUser.isVerified === true) {
      return res.status(400).json({
        message: "Account already verified",
        status: "fail",
      });
    }

    res.status(200).json({
      data: {
        id: formatObj(updatedUser).id,
        username: updatedUser.username,
        email: updatedUser.email,
        fullName: updatedUser.fullName,
        role: updatedUser.role,
      },
      message: "Account verified successfully",
      status: "success",
    });
  } catch (error) {
    res.status(500).json({
      message: error?.message || "Internal server error",
      status: "fail",
    });
  }
};

const deleteAccount = async (req, res) => {
  const { id } = req.params;
  const { id: userId } = req.user;

  try {
    if (id !== userId) {
      return res.status(401).json({
        message: "Unauthorized",
        status: "fail",
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        status: "fail",
      });
    }

    if (user.image) {
      const publicId = extractPublicId(user);
      await cloudinary.uploader.destroy(`uploads/${publicId}`, (error) => {
        if (error) throw new Error("Failed to delete image from Cloudinary");
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        isDeleted: true,
        email: null,
        username: null,
        image: null,
      },
      { new: true }
    );

    res.status(200).json({
      data: formatObj(updatedUser),
      message: "User deleted successfully",
      status: "success",
    });
  } catch (error) {
    res.status(500).json({
      message: error?.message || "Internal server error",
      status: "fail",
    });
  }
};

const freezeAccount = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndUpdate(
      id,
      { isFrozen: true },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        status: "fail",
      });
    }

    res.status(200).json({
      data: formatObj(user),
      message: "User frozen successfully",
      status: "success",
    });
  } catch (error) {
    res.status(500).json({
      message: error?.message || "Internal server error",
      status: "fail",
    });
  }
};

const unfreezeAccount = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndUpdate(
      id,
      { isFrozen: false },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        status: "fail",
      });
    }

    res.status(200).json({
      data: user,
      message: "User unfrozen successfully",
      status: "success",
    });
  } catch (error) {
    res.status(500).json({
      message: error?.message || "Internal server error",
      status: "fail",
    });
  }
};

const banAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const { duration } = req.body; // in minutes

    const banExpiresAt = new Date(Date.now() + duration * 60 * 1000);
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        status: "fail",
      });
    }

    const updated = await User.findByIdAndUpdate(
      id,
      {
        isBanned: true,
        banExpiresAt: banExpiresAt,
      },
      { new: true }
    );

    return res.status(200).json({
      data: formatObj(updated),
      message: `User banned for ${duration} minutes`,
      status: "success",
    });
  } catch (error) {
    res.status(500).json({
      message: error?.message || "Internal server error",
      status: "fail",
    });
  }
};

const unBanAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(
      id,
      {
        isBanned: false,
        banExpiresAt: null,
      },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        status: "fail",
      });
    }

    res.status(200).json({
      data: formatObj(user),
      message: "User unbanned successfully",
      status: "success",
    });
  } catch (error) {
    res.status(500).json({
      message: error?.message || "Internal server error",
      status: "fail",
    });
  }
};

const updateUserInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const { id: userId } = req.user;
    const { username, email } = req.body;

    if (id !== userId) {
      return res.status(401).json({
        message: "Unauthorized",
        status: "fail",
      });
    }

    const duplicate = await User.find({
      $or: [{ username }, { email }],
    });

    if (duplicate.length > 0) {
      return res.status(400).json({
        message: "Username or email already exists!",
        status: "fail",
      });
    }

    const sentUser = {
      ...req.body,
    };

    if (req.file) {
      sentUser.image = req.file.path;
    }

    const prevUser = await User.findById(id);

    if (!prevUser) {
      return res.status(404).json({
        message: "User not found",
        status: "fail",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(id, sentUser, {
      new: true,
      runValidators: true,
    });

    console.log("Previous user image:", prevUser.image);

    if (req.file) {
      const publicId = extractPublicId(prevUser);
      await cloudinary.uploader.destroy(`uploads/${publicId}`, (error) => {
        if (error) throw new Error("Failed to delete image from Cloudinary");
      });
    }

    return res.status(200).json({
      data: formatObj(updatedUser),
      message: "User updated successfully",
      status: "success",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error?.message || "Internal server error",
      status: "fail",
    });
  }
};

const updatePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { id: userId } = req.user;
    const { password, confirmPassword } = req.body;

    if (id !== userId) {
      return res.status(401).json({
        message: "Unauthorized",
        status: "fail",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match",
        status: "fail",
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        status: "fail",
      });
    }

    const isSamePassword = await bcrypt.compare(password, user.password);

    if (isSamePassword) {
      return res.status(400).json({
        message: "New password must be different from the current password",
        status: "fail",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { password: hashedPassword },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
        status: "fail",
      });
    }

    return res.status(200).json({
      message: "Password updated successfully",
      status: "success",
    });
  } catch (error) {
    res.status(500).json({
      message: error?.message || "Internal server error",
      status: "fail",
    });
  }
};

//send email
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const users = await User.find({ email: email, isDeleted: false });
    const user = users[0];

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        status: "fail",
      });
    }

    const token = user.generateToken();

    await transporter
      .sendMail({
        from: process.env.MAIL_USER,
        to: email,
        subject: "Password Reset | Spotify",
        html: `<h1>Click <a href="${process.env.APP_BASE_URL}/reset-password/${token}">here</a> to reset your password</h1> <h3>If you did not send a request, you can ignore this email</h3>`,
      })
      .catch((error) => {
        console.log("error: ", error);
      });

    return res.status(200).json({
      message: "Password reset link sent to your email",
      status: "success",
      token: token,
    });
  } catch (error) {
    res.status(500).json({
      message: error?.message || "Internal server error",
      status: "fail",
    });
  }
};

//reset password
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { id } = req.user;
    const { password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match",
        status: "fail",
      });
    }
    if (!token) {
      return res.status(400).json({
        message: "Token is required",
        status: "fail",
      });
    }
    if (!password || !confirmPassword) {
      return res.status(400).json({
        message: "Both password and confirmPassword are required",
        status: "fail",
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        status: "fail",
      });
    }

    // Log user before updating
    console.log("User found:", user);

    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        password: await bcrypt.hash(password, 10),
      },
      { new: true }
    ).select("-password");

    console.log("Updated User:", updatedUser);

    return res.status(200).json({
      data: updatedUser,
      id: id,
      message: "Password reset successfully",
      status: "success",
    });
  } catch (error) {
    return res.status(500).json({
      message: error?.message || "Internal server error",
      status: "fail",
    });
  }
};

module.exports = {
  getAllNonDeletedUsers, 
  getAllDeletedUsers,  
  getById,  
  register,  
  login,  
  verifyAccount,  
  deleteAccount,  
  freezeAccount,  
  unfreezeAccount,  
  banAccount,  
  unBanAccount,  
  resetPassword,  
  forgotPassword,  
  updatePassword,
  updateUserInfo,  
};
