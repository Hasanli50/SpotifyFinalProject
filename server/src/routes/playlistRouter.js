const {
  createPlaylist,
  getPlaylists,
  getPlaylistById,
  addTracksToPlaylist,
  removeTrackFromPlaylist,
  updatePlaylist,
  deletePlaylist,
  createPlaylistWithCollaborators,
  removeCollaboratorFromPlaylist,
  getPlaylistTracks,
} = require("../controllers/playlistController.js");
const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/verifyToken.js");

router.get("/", verifyToken, getPlaylists); //+
router.post("/", verifyToken, createPlaylist);  //+
router.post("/create", verifyToken, createPlaylistWithCollaborators); //+
router.delete("/:playlistId/removeCollaborator/:collaboratorId", verifyToken, removeCollaboratorFromPlaylist); //+
router.delete("/:playlistId", verifyToken, deletePlaylist); //+
router.get("/:id", verifyToken, getPlaylistById); //+
router.get("/:id/tracks", verifyToken, getPlaylistTracks);
router.patch("/:id", verifyToken, updatePlaylist); //+
router.patch("/:id/addTracks", verifyToken, addTracksToPlaylist);
router.delete(
  "/:playlistId/removeTrack/:trackId",
  verifyToken,
  removeTrackFromPlaylist
);

module.exports = router;
