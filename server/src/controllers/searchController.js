const Track = require("../models/track");
const Album = require("../models/album");
const Artist = require("../models/artist");
const Playlist = require("../models/playlist");

const search = async (req, res) => {
  const searchTerm = req.query.term;

  if (!searchTerm) {
    return res.status(400).json({ error: "Search term is required" });
  }

  try {
    const tracks = await Track.find({
      name: { $regex: searchTerm, $options: "i" },
    })
      .populate("artistId", "username")
      .select("id name artistId");

    const albums = await Album.find({
      name: { $regex: searchTerm, $options: "i" },
    })
      .populate("artistId", "username")
      .select("id name artistId");

    const artists = await Artist.find({
      username: { $regex: searchTerm, $options: "i" },
    }).select("id username track_count");

    const playlists = await Playlist.find({
      name: { $regex: searchTerm, $options: "i" },
    }).select("id name");

    const results = {
      tracks: tracks.map((track) => ({
        id: track.id,
        name: track.name,
        artistId: track.artistId.id,
      })),
      albums: albums.map((album) => ({
        id: album.id,
        name: album.name,
        artistId: album.artistId.id,
      })),
      artists: artists.map((artist) => ({
        id: artist.id,
        name: artist.username,
        track_count: artist.trackIds ? artist.trackIds.length : 0,
      })),
      playlists: playlists.map((playlist) => ({
        id: playlist.id,
        name: playlist.name,
      })),
    };

    return res.status(200).json(results);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};

module.exports = { search };
