const transporter = require("../config/nodemailer.js");
const Artist = require("../models/artist.js");
const formatObj = require("../utils/formatObj.js");
const path = require("path");
const bcrypt = require("bcrypt");
const extractPublicId = require("../utils/extractPublicId.js");
const { cloudinary } = require("../config/imageCloudinary.js");
const Track = require("../models/track.js");

const getAllNonDeletedArtists = async (_, res) => {
  try {
    const artists = await Artist.find({ isDeleted: false }, { password: 0 });
    // .populate("genreIds")
    // .populate("trackIds")
    // .populate("albumIds");
    if (artists.length === 0) {
      return res.status(404).json({
        message: "Artists not found",
        status: "fail",
      });
    }
    res.status(200).json({
      message: "Artists successfully found",
      status: "success",
      data: artists.map(formatObj),
    });
  } catch (error) {
    res.status(500).json({
      message: error?.message || "Internal server error",
      status: "fail",
    });
  }
};

const getAllDeletedArtists = async (_, res) => {
  try {
    const artists = await Artist.find({ isDeleted: true }, { password: 0 });
    // .populate("genreIds")
    // .populate("trackIds")
    // .populate("albumIds");
    if (artists.length === 0) {
      return res.status(404).json({
        message: "Deleted artists not found found",
        status: "fail",
      });
    }
    res.status(200).json({
      message: "Deleted artists fetched successfully",
      status: "success",
      data: artists,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Internal server error",
      status: "fail",
    });
  }
};

const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const artist = await Artist.findById(id, { isDeleted: false }).select(
      "-password"
    );
    // .populate("genreIds")
    // .populate("trackIds")
    // .populate("albumIds");
    if (!artist) {
      return res.status(404).json({
        message: "Artist not found",
        status: "fail",
      });
    }
    res.status(200).json({
      message: "Artist fetched successfully",
      status: "success",
      data: formatObj(artist),
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Internal server error",
      status: "fail",
    });
  }
};

const getByToken = async (req, res) => {
  try {
    const { id } = req.artist;

    const artist = await Artist.findById({ _id: id, isDeleted: false })
      .select("-password")
      .populate("genreIds");
    // .populate("trackIds")
    // .populate("albumIds");
    if (!artist) {
      return res.status(404).json({
        message: "Artist not found",
        status: "fail",
      });
    }
    res.status(200).json({
      message: "Artist fetched successfully",
      status: "success",
      data: formatObj(artist),
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Internal server error",
      status: "fail",
    });
  }
};

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!req.body.username || !req.body.email || !req.body.password) {
      return res.status(400).json({
        message: "Missing required fields",
        status: "fail",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Image upload failed",
        status: "fail",
      });
    }

    const duplicate = await Artist.findOne({
      $or: [{ email }, { username }],
    });
    if (duplicate) {
      return res.status(400).json({
        message: "Username or email already exists!",
        status: "fail",
      });
    }

    const newArtist = new Artist({
      username,
      email,
      password,
      role: "artist",
      genreIds: [],
      image: req.file.path,
      status: "pending",
      isBanned: false,
      isFrozen: false,
      banExpiresAt: null,
      isDeleted: false,
    });

    await newArtist.save();
    const token = newArtist.generateToken();

    res.status(201).json({
      message: "Artist registered successfully, pending approval",
      status: "success",
      data: {
        id: formatObj(newArtist).id,
        username: newArtist.username,
        email: newArtist.email,
        role: newArtist.role,
        image: req.file.path,
        token: token,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Internal server error",
      status: "fail",
    });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const artist = await Artist.login(username, password);
    if (!artist) {
      return res.status(404).json({
        message: "Invalid username or password",
        status: "fail",
      });
    }
    if (artist.status !== "approved") {
      return res.status(403).json({
        message: "Artist not approved yet",
        status: "fail",
      });
    }

    const remainingMilliseconds = artist.banExpiresAt - Date.now();
    if (remainingMilliseconds <= 0) {
      // Unban the artist if the ban has expired
      await Artist.findByIdAndUpdate(artist._id, {
        isBanned: false,
        banExpiresAt: null,
      });
    }
    if (artist.isBanned === true) {
      const remainingMilliseconds = artist.banExpiresAt - Date.now();
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
    if (artist.isFrozen === true) {
      await Artist.findByIdAndUpdate(artist._id, { isFrozen: false });
    }

    res.status(200).json({
      data: {
        id: formatObj(artist).id,
        username: artist.username,
        email: artist.email,
        role: artist.role,
      },
      token: artist.generateToken(), // generate token
      message: "Artist logged in successfully",
      status: "success",
    });
  } catch (error) {
    console.error("Backend Error:", error);
    res.status(500).json({
      message: error.message || "Internal server error",
      status: "fail",
    });
  }
};

const verifyAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedArtist = await Artist.findByIdAndUpdate(
      id,
      {
        status: "approved",
      },
      { new: true }
    );
    if (!updatedArtist) {
      return res.status(404).json({
        message: "Artist not found",
        status: "fail",
      });
    }

    //send mail with nodemailer
    await transporter
      .sendMail({
        from: process.env.MAIL_USER,
        to: updatedArtist.email,
        subject: "Account Verification | Melodies",
        html: `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f7fa;
              margin: 0;
              padding: 0;
            }
            .container {
              width: 100%;
              max-width: 500px;
              margin: 0 auto;
              padding: 10px;
            }
            .header {
              background: linear-gradient(90deg,
                rgba(238, 16, 176, 1) 12%,
                rgba(14, 158, 239, 1) 100%);
              color: white;
              text-align: center;
              padding: 15px 0;
              border-radius: 5px 5px 0 0;
            }
            .header h2 {
              margin: 0;
              font-size: 30px;
              text-transform: capitalize;
            }
            .content {
              background-color: #fff;
              padding: 25px;
              border-radius: 5px;
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            }
            .content p {
              font-size: 16px;
              color: #333;
              line-height: 1.6;
            }
            .cta-button {
              display: inline-block;
              background: linear-gradient(
                90deg,
                rgba(238, 16, 176, 1) 12%,
                rgba(14, 158, 239, 1) 100%
              );
              color: white;
              padding: 15px 50px;
              font-size: 20px;
              text-decoration: none;
              text-transform: capitalize;
              font-weight: 500;
              border-radius: 5px;
              cursor: pointer;
              transition: 0.3s ease-in-out;
              margin-top: 20px;
              text-align: center;
            }
            .cta-button:hover {
              opacity: 0.9;
            }
            .footer {
              text-align: center;
              padding: 20px 0;
              font-size: 12px;
              color: #999;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>Congratulations!</h2>
            </div>
            <div class="content">
              <p>Your account has been successfully verified!</p>
              <p>You're now ready to log in and start your journey with Melodies.</p>
              <a href="${process.env.APP_BASE_URL}/artist/login" class="cta-button">Login</a>
            </div>
            <div class="footer">
              <p>If you did not request this verification, please ignore this email.</p>
            </div>
          </div>
        </body>
      </html>
      `,
      })
      .catch((error) => {
        console.log("error: ", error);
      });

    res.status(200).json({
      data: {
        id: formatObj(updatedArtist).id,
        username: updatedArtist.username,
        email: updatedArtist.email,
        role: updatedArtist.role,
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

  try {
    const artist = await Artist.findById(id);

    if (!artist) {
      return res.status(404).json({
        message: "Artist not found",
        status: "fail",
      });
    }

    if (artist.image) {
      const publicId = extractPublicId(artist);
      await cloudinary.uploader.destroy(`uploads/${publicId}`, (error) => {
        if (error) throw new Error("Failed to delete image from Cloudinary");
      });
    }

    await Track.updateMany(
      { _id: { $in: artist.trackIds } },
      { $pull: { artistIds: artist._id } }
    );

    const updatedArtist = await Artist.findByIdAndUpdate(
      id,
      {
        isDeleted: true,
        email: null,
        username: null,
        image: null,
        genreIds: [],
        trackIds: [],
      },
      { new: true }
    );

    res.status(200).json({
      data: formatObj(updatedArtist),
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
    const artist = await Artist.findByIdAndUpdate(
      id,
      { isFrozen: true },
      { new: true }
    );

    if (!artist) {
      return res.status(404).json({
        message: "Artist not found",
        status: "fail",
      });
    }

    res.status(200).json({
      data: formatObj(artist),
      message: "Artist frozen successfully",
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
    const artist = await Artist.findByIdAndUpdate(
      id,
      { isFrozen: false },
      { new: true }
    );

    if (!artist) {
      return res.status(404).json({
        message: "Artist not found",
        status: "fail",
      });
    }

    res.status(200).json({
      data: formatObj(artist),
      message: "Artist unfrozen successfully",
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
    const artist = await Artist.findById(id);

    if (!artist) {
      return res.status(404).json({
        message: "Artist not found",
        status: "fail",
      });
    }

    const updated = await Artist.findByIdAndUpdate(
      id,
      {
        isBanned: true,
        banExpiresAt: banExpiresAt,
      },
      { new: true }
    );

    return res.status(200).json({
      data: formatObj(updated),
      message: `Artist banned for ${duration} minutes`,
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
    const artist = await Artist.findByIdAndUpdate(
      id,
      {
        isBanned: false,
        banExpiresAt: null,
      },
      { new: true }
    );
    if (!artist) {
      return res.status(404).json({
        message: "Artist not found",
        status: "fail",
      });
    }

    res.status(200).json({
      data: formatObj(artist),
      message: "Artist unbanned successfully",
      status: "success",
    });
  } catch (error) {
    res.status(500).json({
      message: error?.message || "Internal server error",
      status: "fail",
    });
  }
};

const mongoose = require("mongoose");
const updateArtistInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const { id: artistId } = req.artist;
    const { username, email, genreIds, description } = req.body;

    if (id !== artistId) {
      return res.status(401).json({
        message: "Unauthorized",
        status: "fail",
      });
    }

    const genre = genreIds.map((id) => {
      if (mongoose.isValidObjectId(id)) {
        return new mongoose.Types.ObjectId(id);
      } else {
        throw new Error(`Invalid ObjectId: ${id}`);
      }
    });

    const sentArtist = {
      ...req.body,
      genreIds: genre,
    };

    if (req.file) {
      sentArtist.image = req.file.path;
    }

    const prevArtist = await Artist.findById(id);

    if (!prevArtist) {
      return res.status(404).json({
        message: "Artist not found",
        status: "fail",
      });
    }

    const updatedArtist = await Artist.findByIdAndUpdate(id, sentArtist, {
      new: true,
      runValidators: true,
    }).lean();


    if (req.file) {
      const publicId = extractPublicId(prevArtist);
      await cloudinary.uploader.destroy(`uploads/${publicId}`, (error) => {
        if (error) throw new Error("Failed to delete image from Cloudinary");
      });
    }

    return res.status(200).json({
      data: formatObj(updatedArtist),
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
    const { id: artistId } = req.artist;
    const { password, confirmPassword } = req.body;

    if (id !== artistId) {
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

    const artist = await Artist.findById(id);

    if (!artist) {
      return res.status(404).json({
        message: "Artist not found",
        status: "fail",
      });
    }

    const isSamePassword = await bcrypt.compare(password, artist.password);

    if (isSamePassword) {
      return res.status(400).json({
        message: "New password must be different from the current password",
        status: "fail",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const updatedArtist = await Artist.findByIdAndUpdate(
      id,
      { password: hashedPassword },
      { new: true }
    );

    if (!updatedArtist) {
      return res.status(404).json({
        message: "Artist not found",
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
    const artist = await Artist.findOne({ email: email, isDeleted: false });

    if (!artist) {
      return res.status(404).json({
        message: "Artist not found",
        status: "fail",
      });
    }

    const token = artist.generateToken();

    await transporter
      .sendMail({
        from: process.env.MAIL_USER,
        to: email,
        subject: "Password Reset | Spotify",
        html: `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f7fa;
              margin: 0;
              padding: 0;
            }
            .container {
              width: 100%;
              max-width: 500px;
              margin: 0 auto;
              padding: 10px;
            }
            .header {
              background: linear-gradient(90deg,
                  rgba(238, 16, 176, 1) 12%,
                  rgba(14, 158, 239, 1) 100%);
              color: white;
              text-align: center;
              padding: 15px 0;
              border-radius: 5px 5px 0 0;
            }
            .header h1 {
              margin: 0;
              font-size: 24px;
            }
            .content {
              background-color: #f4f7fa;
              padding: 25px;
              border-radius: 5px;
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            }
            .content p {
              font-size: 16px;
              color: #333;
              line-height: 1.6;
            }
            .cta-button {
              display: inline-block;
              background: linear-gradient(90deg,
                  rgba(238, 16, 176, 1) 12%,
                  rgba(14, 158, 239, 1) 100%);
              color: white;
              padding: 15px 25px;
              font-size: 20px;
              text-decoration: none;
              text-transform: capitalize;
              font-weight: 500;
              border-radius: 5px;
              cursor: pointer;
              transition: 0.3s ease-in-out;
              margin-top: 20px;
              text-align: center;
            }
            .cta-button:hover {
             opacity: 0.9;
            }
            .footer {
              text-align: center;
              padding: 20px 0;
              font-size: 12px;
              color: #999;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Password Reset Request</h1>
            </div>
            <div class="content">
              <p>Hello,</p>
              <p>We received a request to reset the password for your Melodies account. If you made this request, you can reset your password by clicking the button below:</p>
              <a href="${process.env.APP_BASE_URL}/artist/reset-password/${token}" class="cta-button">Reset My Password</a>
            </div>
            <div class="footer">
              <p>If you did not sign up for Melodies, you can ignore this email.</p>
            </div>
          </div>
        </body>
      </html>
      `,
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
    const { id } = req.artist;
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

    const artist = await Artist.findById(id);
    if (!artist) {
      return res.status(404).json({
        message: "Artist not found",
        status: "fail",
      });
    }

    const updatedArtist = await Artist.findByIdAndUpdate(
      id,
      {
        password: await bcrypt.hash(password, 10),
      },
      { new: true }
    ).select("-password");

    return res.status(200).json({
      data: updatedArtist,
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
  getAllNonDeletedArtists,
  getAllDeletedArtists,
  // updateStatus,
  getById,
  getByToken,
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
  updateArtistInfo,
  updatePassword,
};
