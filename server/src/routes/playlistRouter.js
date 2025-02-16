const {
  createPlaylist,
  getAllPlaylists,
  getPlaylistsOfUser,
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
const createPlaylistValidation = require("../middlewares/playlistMiddlewares/createPlaylistValidator.js");
const createPlaylistWithCollaboratorsValidation = require("../middlewares/playlistMiddlewares/createPlaylistWithCollaboratorsValidator.js");

router.get("/", verifyToken, getPlaylistsOfUser); //+
router.get("/all-playlists", verifyToken, getAllPlaylists); //+
router.post("/", verifyToken, createPlaylistValidation, createPlaylist); //+
router.post("/create", verifyToken, createPlaylistWithCollaboratorsValidation, createPlaylistWithCollaborators); //+
router.delete(
  "/:playlistId/removeCollaborator/:collaboratorId",
  verifyToken,
  removeCollaboratorFromPlaylist
); //+
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
