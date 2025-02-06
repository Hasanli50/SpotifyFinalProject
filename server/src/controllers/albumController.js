const mongoose = require("mongoose");
const Album = require("../models/album");
const Track = require("../models/track");
const Artist = require("../models/artist");
const formatObj = require("../utils/formatObj");
const { extractPublicIdImage } = require("../utils/extractPublicIdTrack");
const path = require("path");
const { cloudinary } = require("../config/imageCloudinary");

// Create a new album ++
const createAlbum = async (req, res) => {
  try {
    const { name, artistId } = req.body;

    const artist = await Artist.findById(artistId);
    if (!artist) {
      return res
        .status(404)
        .json({ message: "Artist not found", status: "fail" });
    }

    const album = new Album({
      name,
      artistId,
      coverImage: req.file.path,
      trackCount: 0,
      trackIds: [],
      monthlyPlayCount: 0,
    });

    await album.save();

    res.status(201).json({
      message: "Artist registered successfully, pending approval",
      status: "success",
      data: formatObj(album),
    });
  } catch (err) {
    res.status(500).json({
      message: err.message || "Internal server error",
      status: "fail",
    });
  }
};

// Get all albums ++
const getAllAlbums = async (req, res) => {
  try {
    const albums = await Album.find();
    //   .populate("artistId", "username")
    //   .populate("trackIds", "name");

    if (albums.length === 0) {
      return res.status(404).json({
        message: "Albums not found",
        status: "fail",
      });
    }

    return res.status(200).json({
      data: albums.map(formatObj),
      message: "Albums fetched successfully",
      status: "success",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message || "Internal server error",
      status: "fail",
    });
  }
};

// Get a single album by ID ++
const getAlbumById = async (req, res) => {
  try {
    const album = await Album.findById(req.params.id);
    //   .populate("artistId", "name")
    //   .populate("trackIds", "name duration");

    if (!album) {
      return res.status(404).json({
        message: "Album not found",
        status: "fail",
      });
    }

    return res.status(200).json({
      data: formatObj(album),
      message: "Album fetched successfully",
      status: "success",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message || "Internal server error",
      status: "fail",
    });
  }
};

// Update album  ++
const updateAlbum = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const sentAlbum = {
      name,
    };

    if (req.file) {
      sentAlbum.coverImage = req.file.path;
    }

    const prevAlbum = await Album.findById(id);

    if (!prevAlbum) {
      return res.status(404).json({
        message: "Album not found",
        status: "fail",
      });
    }

    const updatedAlbum = await Album.findByIdAndUpdate(id, sentAlbum, {
      new: true,
      runValidators: true,
    });

    if (req.file) {
      const publicId = extractPublicIdImage(prevAlbum);
      await cloudinary.uploader.destroy(`uploads/${publicId}`, (error) => {
        if (error) throw new Error("Failed to delete image from Cloudinary");
      });
    }

    return res.status(200).json({
      data: formatObj(updatedAlbum),
      message: "Album updated successfully",
      status: "success",
    });
  } catch (error) {
    res.status(500).json({
      message: error?.message || "Internal server error",
      status: "fail",
    });
  }
};

// Delete an album by ID
const deleteAlbum = async (req, res) => {
  try {
    const album = await Album.findByIdAndDelete(req.params.id);

    if (!album) {
      return res.status(404).json({ error: "Album not found" });
    }

    res.status(200).json({ message: "Album deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete album" });
  }
};

// Add tracks to an album ++
const addTracksToAlbum = async (req, res) => {
  try {
    const { trackIds } = req.body;

    const album = await Album.findById(req.params.id);

    if (!album) {
      return res.status(404).json({
        message: "Album not found",
        status: "fail",
      });
    }

    const tracks = await Track.find({ _id: { $in: trackIds } });

    if (tracks.length !== trackIds.length) {
      return res.status(404).json({
        message: "One or more tracks not found",
        status: "fail",
      });
    }

    album.trackIds.push(...trackIds);
    album.trackCount = album.trackIds.length;

    await album.save();

    return res.status(200).json({
      data: formatObj(album),
      message: "Track added successfully",
      status: "success",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add tracks to album" });
  }
};

// Remove a track from an album
const removeTrackFromAlbum = async (req, res) => {
  try {
    const { trackId } = req.body;

    const album = await Album.findById(req.params.id);

    if (!album) {
      return res.status(404).json({ error: "Album not found" });
    }

    const index = album.trackIds.indexOf(trackId);
    if (index > -1) {
      album.trackIds.splice(index, 1);
      album.trackCount = album.trackIds.length;

      await album.save();

      res.status(200).json(album);
    } else {
      res.status(404).json({ error: "Track not found in the album" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to remove track from album" });
  }
};

// Increment monthly play count ++
const incrementMonthlyPlayCount = async (req, res) => {
  try {
    const album = await Album.findById(req.params.id);

    if (!album) {
      return res.status(404).json({
        message: "Album not found",
        status: "fail",
      });
    }

    album.monthlyPlayCount += 1;

    await album.save();

    return res.status(200).json({
      data: formatObj(album),
      message: "Album updated successfully",
      status: "success",
    });
  } catch (err) {
    res.status(500).json({
      message: error?.message || "Internal server error",
      status: "fail",
    });
  }
};

module.exports = {
  createAlbum,
  getAllAlbums,
  getAlbumById,
  updateAlbum,
  deleteAlbum,
  addTracksToAlbum,
  removeTrackFromAlbum,
  incrementMonthlyPlayCount,
};
