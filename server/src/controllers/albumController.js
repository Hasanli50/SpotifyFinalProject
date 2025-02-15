const Album = require("../models/album");
const Track = require("../models/track");
const Artist = require("../models/artist");
const formatObj = require("../utils/formatObj");
const { extractPublicIdImage } = require("../utils/extractPublicIdTrack");
const path = require("path");
const { cloudinary } = require("../config/imageCloudinary");
const Playlist = require("../models/playlist");
const mongoose = require("mongoose");

// Create a new album ++
const createAlbum = async (req, res) => {
  try {
    const { name, artistId } = req.body;
    // console.log("req.body: ",req.body)

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
    console.log("newAlbum: ", album);
    await album.save();

    artist.albumIds.push(album._id);
    artist.albums_count += 1;
    await artist.save();

    res.status(201).json({
      message: "Artist successfully created",
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

// Delete an album by ID ++
const deleteAlbum = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid album ID format" });
    }

    const objectId = new mongoose.Types.ObjectId(id);

    const album = await Album.findByIdAndDelete(objectId);

    if (!album) {
      return res.status(404).json({ error: "Album not found" });
    }

    if (album.coverImage) {
      const publicId = extractPublicIdImage(album);
      await cloudinary.uploader.destroy(`uploads/${publicId}`);
    }

    // Step 1: Delete all tracks from the Track model that were associated with the album
    await Track.deleteMany({ _id: { $in: album.trackIds } },  { new: true });

    // Step 2: Remove the trackIds from all playlists that contain any of the deleted tracks
    await Playlist.updateMany(
      { "trackIds.trackId": { $in: album.trackIds } },
      { $pull: { trackIds: { trackId: { $in: album.trackIds } } } },  { new: true }
    );

    // Step 3: Remove the trackIds from the Artist model
    await Artist.updateMany(
      { trackIds: { $in: album.trackIds } },
      {
        $pull: { trackIds: { $in: album.trackIds } },
      },
      { new: true }
    );

    // Step 4: Update artist album list by removing the deleted albumId
    await Artist.findByIdAndUpdate(
      album.artistId,
      { $pull: { albumIds: album._id }, $inc: { albums_count: -1 } },
      { new: true }
    );

    // Respond back with success
    res.status(200).json({
      message: "Album and associated data deleted successfully",
      status: "success",
    });
  } catch (error) {
    res.status(500).json({
      message: error?.message || "Internal server error",
      status: "fail",
    });
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

    const artist = await Artist.findById(album.artistId);

    if (!artist) {
      return res.status(404).json({
        message: "Artist not found",
        status: "fail",
      });
    }

    artist.trackIds.push(...trackIds);
    await artist.save();

    return res.status(200).json({
      data: formatObj(album),
      message: "Track added successfully",
      status: "success",
    });
  } catch (err) {
    res.status(500).json({
      message: err?.message || "Internal server error",
      status: "fail",
    });
  }
};

// Remove a track from an album ++
const removeTrackFromAlbum = async (req, res) => {
  try {
    const { trackId } = req.body;

    const album = await Album.findById(req.params.id);
    if (!album) {
      return res.status(404).json({
        message: "Album not found",
        status: "fail",
      });
    }

    const trackObjectId = new mongoose.Types.ObjectId(trackId);

    const index = album.trackIds.findIndex((track) =>
      track.equals(trackObjectId)
    );

    if (index > -1) {
      album.trackIds.splice(index, 1);
      album.trackCount = album.trackIds.length;

      const track = await Track.findById(trackObjectId);
      if (track && track.coverImage) {
        const publicId = extractPublicIdImage(album);
        await cloudinary.uploader.destroy(`uploads/${publicId}`);
      }

      // Step 1: Delete the track from the Track model
      await Track.findByIdAndDelete(trackObjectId);

      // Step 2: Remove the trackId from all Playlists that contain this track
      await Playlist.updateMany(
        { "trackIds.trackId": trackObjectId },
        { $pull: { trackIds: { trackId: trackObjectId } } }
      );

      // Step 3: Remove the trackId from the Artist model
      await Artist.updateMany(
        { trackIds: trackObjectId },
        { $pull: { trackIds: trackObjectId } }
      );

      await album.save();

      res.status(200).json({
        message: "Track removed from album, playlists, and artist",
        status: "success",
        album,
      });
    } else {
      return res.status(404).json({
        message: "Track not found in the album",
        status: "fail",
      });
    }
  } catch (err) {
    res.status(500).json({
      message: err.message || "Internal server error",
      status: "fail",
    });
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
