const transporter = require("../config/nodemailer.js");
const Artist = require("../models/artist.js");
const formatObj = require("../utils/formatObj.js");
const path = require("path");
const bcrypt = require("bcrypt");
const extractPublicId = require("../utils/extractPublicId.js");
const { cloudinary } = require("../config/imageCloudinary.js");

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

const getAllPendingStatus = async (_, res) => {
  try {
    const artists = await Artist.find({ status: "pending" }, { password: 0 });
    if (artists.length === 0) {
      return res.status(404).json({
        message: "Pending status artists not found",
        status: "fail",
      });
    }
    res.status(200).json({
      message: "Pending artists fetched successfully",
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

const register = async (req, res) => {
  try {
    const { username, genreIds, description, email, password } = req.body;

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
      genreIds,
      description,
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
    console.log(newArtist);
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

    //check if ban is expired
    if (artist.banExpiresAt < Date.now()) {
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
  const { id: artistId } = req.artist;

  try {
    if (id !== artistId) {
      return res.status(401).json({
        message: "Unauthorized",
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

    if (artist.image) {
      const publicId = extractPublicId(artist);
      await cloudinary.uploader.destroy(`uploads/${publicId}`, (error) => {
        if (error) throw new Error("Failed to delete image from Cloudinary");
      });
    }

    await Track.updateMany(
      { _id: { $in: artist.trackIds } }, // Filter tracks where the artist's trackIds are present
      { $pull: { artistIds: artist._id } } // Remove the artist from the artistIds of those tracks
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

const updateArtistInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const { id: artistId } = req.artist;
    const { username, email, genreIds } = req.body;

    if (id !== artistId) {
      return res.status(401).json({
        message: "Unauthorized",
        status: "fail",
      });
    }

    const duplicate = await Artist.find({
      $or: [{ username }, { email }],
    });

    if (duplicate.length > 0) {
      return res.status(400).json({
        message: "Username or email already exists!",
        status: "fail",
      });
    }

    const sentArtist = {
      ...req.body,
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
    });

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
    console.log("Email received:", email);
    const artists = await Artist.find({ isDeleted: false });
    const artist = artists[0];
    console.log(artists);

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
        html: `<h1>Click <a href="${process.env.APP_BASE_URL}/artists/reset-password/${token}">here</a> to reset your password</h1> <h3>If you did not send a request, you can ignore this email</h3>`,
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
    console.log(req.artist.id);
    const { password, confirmPassword } = req.body;
    console.log("Token:", token); // Log token for debugging

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

    // Log artist before updating
    console.log("Artist found:", artist);

    const updatedArtist = await Artist.findByIdAndUpdate(
      id,
      {
        password: await bcrypt.hash(password, 10),
      },
      { new: true }
    ).select("-password");

    console.log("Updated Artisr:", updatedArtist);

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
  getAllPendingStatus,
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
  updateArtistInfo,
  updatePassword,
};
