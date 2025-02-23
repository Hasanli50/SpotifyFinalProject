const express = require("express");
const router = express.Router();
const fileUpload = require("../config/trackMulter.js");
const {
  createTrack,
  createAlbumSong,
  getTrackById,
  getAllTracks,
  deleteTrack,
  changePremium,
  incrementPlayCount,
} = require("../controllers/trackController.js");
const createTrackValidator = require("../middlewares/trackMiddlewares/createTrackValidator.js");

router.post(
  "/",
  fileUpload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "previewUrl", maxCount: 1 },
  ]),
  createTrackValidator,
  createTrack
); //+

router.post(
  "/albumSong",
  fileUpload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "previewUrl", maxCount: 1 },
  ]),
  createTrackValidator,
  createAlbumSong
); //+
router.get("/:id", getTrackById); //+
router.get("/", getAllTracks); //+
router.delete(
  "/:id",
  fileUpload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "previewUrl", maxCount: 1 },
  ]),
  deleteTrack
);
router.patch("/:id/increment-play", incrementPlayCount); //+
router.patch("/:id/premium-only", changePremium);

module.exports = router;
