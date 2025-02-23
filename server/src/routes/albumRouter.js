const express = require("express");
const router = express.Router();
const imageUpload = require("../config/imageMulter.js");
const {
  createAlbum,
  getAllAlbums,
  getAlbumById,
  updateAlbum,
  deleteAlbum,
  addTracksToAlbum,
  removeTrackFromAlbum,
  incrementMonthlyPlayCount,
} = require("../controllers/albumController.js");
const createAlbumValidation = require("../middlewares/albumMiddlewares/createAlbumValidator.js");
const updateAlbumValidatiion = require("../middlewares/albumMiddlewares/updateAlbumValidator.js");

router.post(
  "/",
  imageUpload.single("coverImage"),
  createAlbumValidation,
  createAlbum
);
router.get("/", getAllAlbums);
router.get("/:id", getAlbumById);
router.patch(
  "/:id",
  imageUpload.single("coverImage"),
  updateAlbumValidatiion,
  updateAlbum
);
router.delete("/:id", imageUpload.single("coverImage"), deleteAlbum);
router.patch("/:id/tracks", addTracksToAlbum);
router.delete(
  "/:id/tracks",
  imageUpload.single("coverImage"),
  removeTrackFromAlbum
);
router.patch("/:id/increment-play", incrementMonthlyPlayCount);

module.exports = router;
