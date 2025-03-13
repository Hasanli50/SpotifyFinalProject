const Genre = require("../models/genre.js");
const formatObj = require("../utils/formatObj.js");
const Track = require("../models/track");

const createGenre = async (req, res) => {
  try {
    const { name } = req.body;
    const existingGenre = await Genre.findOne({ name });
    if (existingGenre) {
      return res
        .status(400)
        .json({ message: "Genre already exists.", status: "fail", data: {} });
    }
    const genre = new Genre({ name });
    await genre.save();

    return res.status(201).json({
      message: "Genre created successfully.",
      status: "success",
      data: formatObj(genre),
    });
  } catch (error) {
    res.status(500).json({
      message: error?.message || "Internal server error",
      status: "fail",
    });
  }
};

const getAllGenres = async (_, res) => {
  try {
    const genres = await Genre.find().sort({ name: 1 }); 
    if (genres.length === 0) {
      return res.status(404).json({
        message: "Genres not found",
        status: "fail",
      });
    }
    res.status(200).json({
      message: "Genres successfully found",
      status: "success",
      data: genres.map(formatObj),
    });
  } catch (error) {
    res.status(500).json({
      message: error?.message || "Internal server error",
      status: "fail",
    });
  }
};

const deleteGenre = async (req, res) => {
  try {
    const genre = await Genre.findByIdAndDelete(req.params.id);

    if (!genre) {
      return res.status(404).json({ message: "Genre not found." });
    }

    return res.status(200).json({ message: "Genre deleted successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error." });
  }
};

const getGenreById = async (req, res) => {
  try {
    const genre = await Genre.findById(req.params.id);

    if (!genre) {
      return res.status(404).json({
        message: "Genres not found",
        status: "fail",
      });
    }

    res.status(200).json({
      message: "Genre successfully found",
      status: "success",
      data: formatObj(genre),
    });
  } catch (error) {
    res.status(500).json({
      message: error?.message || "Internal server error",
      status: "fail",
    });
  }
};

// Get all tracks by genre
const getTracksByGenre = async (req, res) => {
  try {
    const genreId = req.params.id;
    const tracks = await Track.find({ genreId });

    if (!tracks.length) {
      return res.status(404).json({
        message: "No tracks found for this genre.",
        status: "fail",
        data: {},
      });
    }

    res.status(200).json({
      message: "Genre in tracks successfully found",
      status: "success",
      data: tracks.map(formatObj),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error." });
  }
};

module.exports = {
  createGenre,
  getAllGenres,
  deleteGenre,
  getGenreById,
  getTracksByGenre,
};
