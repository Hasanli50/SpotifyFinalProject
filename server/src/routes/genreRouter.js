const express = require("express");
const router = express.Router();
const {
  createGenre,
  getAllGenres,
  getGenreById,
  getTracksByGenre,
  deleteGenre,
} = require("../controllers/genreController");

router.post("/", createGenre);
router.get("/", getAllGenres);
router.get("/:id", getGenreById);
router.delete("/:id", deleteGenre);
router.get("/:id/tracks", getTracksByGenre);

module.exports = router;
