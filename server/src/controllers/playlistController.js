const Playlist = require("../models/playlist");
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
      collaborators: [],
    });

    await newPlaylist.save();

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        status: "fail",
      });
    }

    user.playlistCount += 1;
    await user.save();

    return res.status(201).json({
      data: formatObj(newPlaylist),
      message: "Playlist created successfully and user playlist count updated",
      status: "success",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal server error",
      status: "fail",
    });
  }
};

//get all playlists
const getAllPlaylists = async (req, res) => {
  try {
    const playlists = await Playlist.find({});

    if (!playlists.length) {
      return res.status(200).json({
        data: {},
        message: "Playlists not found",
        status: "success",
      });
    }

    return res.status(200).json({
      data: playlists.map(formatObj),
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

// Get all playlists of a user
const getPlaylistsOfUser = async (req, res) => {
  try {
    const userId = req.user.id; 

    const playlists = await Playlist.find({ userId });
    //   .populate("trackIds.trackId") 
    //   .exec();

    return res.status(200).json({
      data: playlists.map(formatObj),
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
const getPlaylistById = async (req, res) => {
  try {
    const { id } = req.params;

    const playlist = await Playlist.findById(id);
    // .populate("trackIds.trackId")
    // .exec();

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
    const { trackId, type } = req.body;

    if (!trackId || !type) {
      return res.status(400).json({
        message: "Both 'trackId' and 'type' are required.",
        status: "fail",
      });
    }

    const playlist = await Playlist.findById(id);

    if (!playlist) {
      return res.status(404).json({
        message: "Playlist not found",
        status: "fail",
      });
    }

    const trackExists = playlist.trackIds.some(
      (track) => track.trackId.toString() === trackId && track.type === type
    );

    if (trackExists) {
      return res.status(400).json({
        message: "Track already exists in the playlist.",
        status: "fail",
      });
    }

    playlist.trackIds.push({ trackId, type });

    await playlist.save();

    return res.status(200).json({
      data: playlist,
      message: "Track added successfully.",
      status: "success",
    });
  } catch (error) {
    console.error("Error:", error);
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

    const initialLength = playlist.trackIds.length;
    playlist.trackIds = playlist.trackIds.filter(
      (track) => track.trackId.toString() !== trackId
    );

    if (initialLength === playlist.trackIds.length) {
      return res.status(404).json({
        message: "Track not found in the playlist",
        status: "fail",
      });
    }

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

// Update playlist details 
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

    if (playlist.userId.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You do not have permission to update this playlist",
        status: "fail",
      });
    }

    if (name) {
      playlist.name = name;
    }


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
    const { playlistId } = req.params;
    const userId = req.user.id;
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
      return res.status(404).json({
        message: "Playlist not found",
        status: "fail",
      });
    }

    if (playlist.userId.toString() !== userId) {
      return res.status(403).json({
        message: "You can only delete your own playlists",
        status: "fail",
      });
    }

    const user = await User.findById(userId);
    if (user) {
      user.playlistCount -= 1;
      user.collaboratedUserId.pop(playlistId);
      await user.save();
    }

    if (playlist.collaborators && playlist.collaborators.length > 0) {
      for (const collaboratorId of playlist.collaborators) {
        const collaborator = await User.findById(collaboratorId);
        if (collaborator) {
          collaborator.collaboratedUserId =
            collaborator.collaboratedUserId.filter(
              (id) => id.toString() !== playlistId
            );
          collaborator.playlistCount -= 1;
          await collaborator.save();
        }
      }
    }

    await Playlist.findByIdAndDelete(playlistId);

    return res.status(200).json({
      message: "Playlist and collaborators updated successfully",
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
      .populate("trackIds.trackId") 
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

// Create a new playlist and add collaborators
const createPlaylistWithCollaborators = async (req, res) => {
  try {
    const { name, collaborators } = req.body;
    const userId = req.user.id;

    const newPlaylist = new Playlist({
      name,
      collaborators,
      userId,
      trackCount: 0,
      isMix: false,
    });

    await newPlaylist.save();

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        status: "fail",
      });
    }

    user.playlistCount += 1;
    user.collaboratedUserId.push(newPlaylist._id);
    await user.save();

    if (collaborators && collaborators.length > 0) {
      newPlaylist.collaborators = [userId, ...collaborators];
      await newPlaylist.save();

      for (const collaboratorId of collaborators) {
        const collaborator = await User.findById(collaboratorId);
        if (collaborator) {
          collaborator.playlistCount += 1;
          collaborator.collaboratedUserId.push(newPlaylist._id);
          await collaborator.save();
        }
      }
    }

    return res.status(201).json({
      data: formatObj(newPlaylist),
      message: "Playlist created successfully and collaborators added",
      status: "success",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal server error",
      status: "fail",
    });
  }
};

// Remove a collaborator from a playlist
const removeCollaboratorFromPlaylist = async (req, res) => {
  try {
    const { playlistId, collaboratorId } = req.params;

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
      return res.status(404).json({
        message: "Playlist not found",
        status: "fail",
      });
    }

    playlist.collaborators = playlist.collaborators.filter(
      (userId) => userId.toString() !== collaboratorId
    );
    await playlist.save();

    const collaborator = await User.findById(collaboratorId);
    if (collaborator) {
      collaborator.collaboratedUserId = collaborator.collaboratedUserId.filter(
        (id) => id.toString() !== playlistId
      );
      await collaborator.save();
    }

    return res.status(200).json({
      message: "Collaborator removed from playlist successfully",
      status: "success",
      data: formatObj(playlist),
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
  getAllPlaylists,
  getPlaylistsOfUser,
  getPlaylistById,
  addTracksToPlaylist,
  removeTrackFromPlaylist,
  updatePlaylist,
  deletePlaylist,
  getPlaylistTracks,
  createPlaylistWithCollaborators,
  removeCollaboratorFromPlaylist,
};
