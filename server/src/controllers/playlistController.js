const Playlist = require("../models/playlist");
const Track = require("../models/track");
const User = require("../models/user");
const formatObj = require("../utils/formatObj");

// Create a new playlist
const createPlaylist = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.user.id;

    const newPlaylist = new Playlist({
      name,
      userId,
      isMix: false,
    });

    await newPlaylist.save();

    user.playlistCount += 1;
    await user.save();

    return res.status(201).json({
      data: formatObj(newPlaylist),
      message: "Playlist created successfully",
      status: "success",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal server error",
      status: "fail",
    });
  }
};

// Get all playlists of a user
const getPlaylists = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming user ID is stored in req.user

    const playlists = await Playlist.find({ userId })
      .populate("trackIds.trackId") // Populate track information for trackIds
      .exec();

    return res.status(200).json({
      data: playlists,
      message: "Playlists fetched successfully",
      status: "success",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal server error",
      status: "fail",
    });
  }
};

// Get a single playlist
const getPlaylist = async (req, res) => {
  try {
    const { id } = req.params;

    const playlist = await Playlist.findById(id)
      .populate("trackIds.trackId") // Populate track information
      .exec();

    if (!playlist) {
      return res.status(404).json({
        message: "Playlist not found",
        status: "fail",
      });
    }

    return res.status(200).json({
      data: formatObj(playlist),
      message: "Playlist fetched successfully",
      status: "success",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal server error",
      status: "fail",
    });
  }
};

// Add tracks to playlist
const addTracksToPlaylist = async (req, res) => {
  try {
    const { id } = req.params;
    const { tracks } = req.body; // tracks is an array of { trackId, type }

    const playlist = await Playlist.findById(id);

    if (!playlist) {
      return res.status(404).json({
        message: "Playlist not found",
        status: "fail",
      });
    }

    for (const track of tracks) {
      playlist.trackIds.push(track);
    }

    await playlist.save();

    return res.status(200).json({
      data: playlist,
      message: "Tracks added successfully",
      status: "success",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal server error",
      status: "fail",
    });
  }
};

// Remove a track from a playlist
const removeTrackFromPlaylist = async (req, res) => {
  try {
    const { playlistId, trackId } = req.params;

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
      return res.status(404).json({
        message: "Playlist not found",
        status: "fail",
      });
    }

    playlist.trackIds = playlist.trackIds.filter(
      (track) => track.trackId.toString() !== trackId
    );

    await playlist.save();

    return res.status(200).json({
      data: playlist,
      message: "Track removed from playlist",
      status: "success",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal server error",
      status: "fail",
    });
  }
};

// Update playlist details (e.g., name)
const updatePlaylist = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const playlist = await Playlist.findById(id);

    if (!playlist) {
      return res.status(404).json({
        message: "Playlist not found",
        status: "fail",
      });
    }

    playlist.name = name || playlist.name;

    await playlist.save();

    return res.status(200).json({
      data: formatObj(playlist),
      message: "Playlist updated successfully",
      status: "success",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal server error",
      status: "fail",
    });
  }
};

// Delete a playlist
const deletePlaylist = async (req, res) => {
  try {
    const { id } = req.params;

    const playlist = await Playlist.findById(id);

    if (!playlist) {
      return res.status(404).json({
        message: "Playlist not found",
        status: "fail",
      });
    }

    const user = await User.findById(playlist.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        status: "fail",
      });
    }

    await playlist.remove();

    user.playlistCount -= 1;
    await user.save();
    
    return res.status(200).json({
      message: "Playlist deleted successfully",
      status: "success",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal server error",
      status: "fail",
    });
  }
};

// Get all tracks in a playlist
const getPlaylistTracks = async (req, res) => {
  try {
    const { id } = req.params;

    const playlist = await Playlist.findById(id)
      .populate("trackIds.trackId") // Populate track information
      .exec();

    if (!playlist) {
      return res.status(404).json({
        message: "Playlist not found",
        status: "fail",
      });
    }

    return res.status(200).json({
      data: formatObj(playlist.trackIds),
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

module.exports = {
  createPlaylist,
  getPlaylists,
  getPlaylist,
  addTracksToPlaylist,
  removeTrackFromPlaylist,
  updatePlaylist,
  deletePlaylist,
  getPlaylistTracks,
};
