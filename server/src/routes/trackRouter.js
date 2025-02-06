const express = require("express");
const router = express.Router();
const fileUpload = require("../config/trackMulter.js");
const {
  createTrack,
  getTrackById,
  getAllTracks,
  updateTrack,
  deleteTrack,
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
router.patch("/:id/increment-play", incrementPlayCount) //+

module.exports = router;
