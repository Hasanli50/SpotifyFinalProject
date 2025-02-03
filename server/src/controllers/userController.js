const transporter = require("../config/nodemailer.js");
const User = require("../models/user.js");
const formatObj = require("../utils/formatObj.js");
const path = require("path");
// const { cloudinary } = require("../config/cloudinary.js");
// const { extractPublicIdUser } = require("../utils/extractPublicId.js");

const getAll = async (_, res) => {
  try {
    const users = await User.find({}, { password: 0 });
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

const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id, "-password");
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
    const { username, email, password, image } = req.body;

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
      image,
      //   image: req.file.path,
    });

    await newUser.save();

    const token = newUser.generateToken();
    //send mail with nodemailer
    await transporter
      .sendMail({
        from: process.env.MAIL_USER,
        to: email,
        subject: "Account Verification | Spotify",
        html: `<h1>Click <a href="${process.env.APP_BASE_URL}/users/verify/${newUser._id}">here</a> to verify your account</h1>`,
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
        image: newUser.image,
        // image: req.file.path,
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
    const { id } = req.params;
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

module.exports = {
  getAll,
  getById,
  register,
  login,
  //   resetPassword,
    verifyAccount,
  //   forgotPassword,
  //   updateUserInfo,
  //   deleteAccount,
  //   updatePassword,
};
