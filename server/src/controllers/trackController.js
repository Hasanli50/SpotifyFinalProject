const { cloudinary } = require("../config/trackCloudinary.js");
const Album = require("../models/album.js");
const Artist = require("../models/artist.js");
const Playlist = require("../models/playlist.js");
const Track = require("../models/track.js");
const {
  extractPublicIdImage,
  extractPublicIAudio,
} = require("../utils/extractPublicIdTrack.js");
const formatObj = require("../utils/formatObj.js");

// Create a new track
const createTrack = async (req, res) => {
  try {
    const { name, artistId, duration, genreId, type, premiumOnly } = req.body;
    console.log("req body: ", req.body);

    const artist = await Artist.findById(artistId);
    if (!artist) {
      return res
        .status(404)
        .json({ message: "Artist not found", status: "fail" });
    }

    const coverImage = req.files?.coverImage
      ? req.files.coverImage[0].path
      : null;
    const previewUrl = req.files?.previewUrl
      ? req.files.previewUrl[0].path
      : null;

    if (!coverImage || !previewUrl) {
      return res.status(400).json({
        message: "Both cover image and preview URL are required.",
        status: "fail",
      });
    }

    const track = new Track({
      name,
      artistId,
      albumId: null,
      duration,
      genreId,
      type,
      previewUrl,
      coverImage,
      premiumOnly,
      collaboratedArtistIds: [],
    });
    await track.save();

    artist.trackIds.push(track._id);
    await artist.save();

    return res.status(201).json({
      data: formatObj(track),
      message: "Track created successfully",
      status: "success",
    });
  } catch (error) {
    console.error("Error saving track:", error);
    return res.status(500).json({
      message: error.message || "Internal server error",
      status: "fail",
    });
  }
};

// Get a track by ID
const getTrackById = async (req, res) => {
  try {
    const { id } = req.params;

    const track = await Track.findById(id); //.populate("artistId albumId genreId");

    if (!track) {
      return res.status(404).json({
        message: "Track not found",
        status: "fail",
      });
    }
    // console.log(track.previewUrl.split("/").reverse()[0].split("20%")[0]);
    // console.log(track.coverImage.split("/").reverse()[0].split(".")[0]);
    // console.log(track.previewUrl);

    // console.log("Original previewUrl:", track.previewUrl);
    const publicId = extractPublicIAudio(track);
    console.log("Extracted Public ID for Audio:", publicId);

    // const publicAudio = extractPublicIdImage(track);
    // console.log(publicAudio);

    return res.status(200).json({
      data: formatObj(track),
      message: "Track fetched successfully",
      status: "success",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal server error",
      status: "fail",
    });
  }
};

// Get all tracks
const getAllTracks = async (req, res) => {
  try {
    const tracks = await Track.find({}).populate("artistId albumId genreId");

    if (!tracks.length) {
      return res.status(404).json({
        message: "No tracks found",
        status: "fail",
      });
    }

    return res.status(200).json({
      data: tracks.map(formatObj),
      message: "Tracks fetched successfully",
      status: "success",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal server error",
      status: "fail",
    });
  }
};

// Delete a track - have bug ????
const deleteTrack = async (req, res) => {
  try {
    const { id } = req.params;

    const track = await Track.findById(id);
    if (!track) {
      return res.status(404).json({
        message: "Track not found",
        status: "fail",
      });
    }

    await Playlist.updateMany(
      { "trackIds.trackId": track._id },
      { $pull: { trackIds: { trackId: track._id } } }
    );

    await Artist.updateOne(
      { _id: track.artistId },
      { $pull: { trackIds: track._id } }
    );

    if (track.type === "album" && track.albumId) {
      await Album.updateOne(
        { _id: track.albumId },
        { $pull: { trackIds: track._id }, $inc: { trackCount: -1 } }
      );
    }

    if (track.coverImage) {
      const publicId = extractPublicIdImage(track);
      const result = await cloudinary.uploader.destroy(`uploads/${publicId}`);
      console.log("Cloudinary Response:", result);
      if (result.result !== "ok") {
        throw new Error("Failed to delete image from Cloudinary");
      }
    }
    console.log(track.previewUrl);

    if (track.previewUrl) {
      const publicId = extractPublicIAudio(track);
      console.log(publicId);
      const result = await cloudinary.uploader.destroy(`uploads/${publicId}`);
      console.log("Cloudinary Response:", result);
      if (result.result !== "ok") {
        throw new Error("Failed to delete audio from Cloudinary");
      }
    }

    await Track.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Track deleted successfully",
      status: "success",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal server error",
      status: "fail",
    });
  }
};

// Increment play count for a track
const incrementPlayCount = async (req, res) => {
  try {
    const { id } = req.params;

    const track = await Track.findById(id);

    if (!track) {
      return res.status(404).json({
        message: "Track not found",
        status: "fail",
      });
    }

    track.playCount += 1;
    await track.save();

    return res.status(200).json({
      data: track,
      message: "Track play count updated",
      status: "success",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal server error",
      status: "fail",
    });
  }
};

const changePremium = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedTrack = await Track.findByIdAndUpdate(
      id,
      { premiumOnly: false },
      { new: true }
    );
    if (!updatedTrack) {
      return res.status(404).json({
        message: "Track not found",
        status: "fail",
      });
    }

    res.status(200).json({
      data: formatObj(updatedTrack),
      message: "Premium changed",
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
  createTrack,
  getTrackById,
  getAllTracks,
  deleteTrack,
  incrementPlayCount,
  changePremium,
};
