import axios from "axios";
import style from "../../assets/style/user/artistDetail.module.scss";
import { useEffect, useRef, useState } from "react";
import { BASE_URL, ENDPOINT } from "../../api/endpoint";
import { getUserFromStorage } from "../../utils/localeStorage";
import moment from "moment";
import { fetchUserByToken, formatDuration } from "../../utils/reusableFunc";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Menu, MenuItem } from "@mui/material";
import NewPlaylist from "../../components/user/NewPlaylist";
import { useFetchALlPlaylistsByUser } from "../../hooks/usePlaylist";
import { useAllTracks } from "../../hooks/useTrack";
import toast from "react-hot-toast";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import SearchIcon from "@mui/icons-material/Search";

const PremiumTracks = () => {
  //get user by token
  const [user, setUser] = useState([]);
  const [premiumTracks, setPremiumTracks] = useState([]);
  const { data: tracks } = useAllTracks();
  const [favorites, setFavorites] = useState([]);
  const { data: playlists } = useFetchALlPlaylistsByUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchSong, setSearchSong] = useState("");
  const [filteredData, setFilteredData] = useState(playlists);
  const [filterPremiumSong, setFilterPremiumSong] = useState(premiumTracks);

  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const token = getUserFromStorage();
  useEffect(() => {
    const getUserByToken = async () => {
      try {
        const response = await fetchUserByToken(token);
        setUser(response);
      } catch (error) {
        console.log("Error:", error);
      }
    };
    getUserByToken();
  }, [token]);

  useEffect(() => {
    try {
      const filteredSongs = tracks.filter((song) => song.premiumOnly === true);
      setPremiumTracks(filteredSongs);
      console.log("premium: ", filteredSongs);
    } catch (error) {
      console.log("Error: ", error);
    }
  }, [tracks]);

  //----------------------------------------------------
  const handlePlayMusic = (song) => {
    if (currentSong && currentSong.id === song.id) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsPlaying(false);
      setCurrentSong(null);
    } else {
      setCurrentSong(song);
      if (audioRef.current) {
        audioRef.current.pause();
      }
      audioRef.current = new Audio(song.previewUrl);
      audioRef.current.play();
      setIsPlaying(true);

      handlePlayCount(song.id);
    }
  };

  //increment playcount
  const handlePlayCount = async (id) => {
    try {
      const response = await axios.patch(
        `${BASE_URL + ENDPOINT.tracks}/${id}/increment-play`
      );

      console.log(response.data.data);
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  //----------------------------------------------------
  useEffect(() => {
    const savedFavorites =
      JSON.parse(localStorage.getItem(`userFavorites_${user.id}`)) || [];
    setFavorites(savedFavorites);
  }, [user.id]);

  const toggleFavorite = (songId) => {
    let updatedFavorites = [...favorites];

    if (updatedFavorites.includes(songId)) {
      updatedFavorites = updatedFavorites.filter((id) => id !== songId);
    } else {
      updatedFavorites.push(songId);
    }

    setFavorites(updatedFavorites);

    localStorage.setItem(
      `userFavorites_${user.id}`,
      JSON.stringify(updatedFavorites)
    );
  };

  const isFavorite = (songId) => {
    return favorites.includes(songId);
  };

  //----------------------------------------------------
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentSongId, setCurrentSongId] = useState(null);

  const handleMenuClick = (event, songId) => {
    setAnchorEl(event.currentTarget);
    setCurrentSongId(songId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setCurrentSongId(null);
  };

  //----------------------------------------------------
  useEffect(() => {
    const data = playlists?.filter((value) =>
      value.name.trim().toLowerCase().includes(searchQuery.trim().toLowerCase())
    );
    setFilteredData(data);
  }, [playlists, searchQuery]);

  //----------------------------------------------------
  const handleAddTrack = async (playlistId, songId, songType) => {
    XMLDocument;
    console.log("playlistId:", playlistId);
    console.log("songId:", songId);
    try {
      await axios.patch(
        `${BASE_URL + ENDPOINT.playlists}/${playlistId}/addTracks`,
        {
          trackId: songId,
          type: songType,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Song successfully added to playlist!");
    } catch (error) {
      console.log("Error:", error.response?.data?.message || error.message);
      toast.error("Song already have in playlist!");
    }
  };

  useEffect(() => {
    const songs = premiumTracks?.filter(
      (value) =>
        value?.name
          ?.trim()
          .toLowerCase()
          .includes(searchSong.trim().toLowerCase()) ||
        value?.artistId?.username
          ?.trim()
          .toLowerCase()
          .includes(searchSong.trim().toLowerCase())
    );
    setFilterPremiumSong(songs);
  }, [premiumTracks, searchSong]);

  return (
    <>
      <section className={style.allSingleSongs}>
        <div className={style.inputBox}>
          <input
            onChange={(e) => setSearchSong(e.target.value)}
            type="text"
            value={searchSong}
            className={style.input}
            placeholder="Search for artists, songs..."
          />
          <SearchIcon className={style.searchIcon} />
        </div>

        <p className={style.heading}>Premium Songs:</p>

        {filterPremiumSong?.length > 0 ? (
          filterPremiumSong.map((songs, index) => (
            <div className={style.box} key={songs.id}>
              <p className={style.place}>{index + 1}.</p>
              <div className={style.songsCard}>
                <div
                  style={{
                    display: "flex",
                    gap: "7px",
                    alignItems: "center",
                  }}
                >
                  <div className={style.songsCard__imgBox}>
                    <img
                      className={style.songsCard__imgBox__img}
                      src={songs.coverImage}
                      alt="coverImage"
                    />
                  </div>
                  <div>
                    <p className={style.letterTop}>{songs.name}</p>
                    <p className={style.letterBottom}>
                      {songs?.artistId?.username}
                    </p>
                  </div>
                </div>

                <p className={style.songsCard__letter}>
                  {moment(songs?.createdAt).format("MMM Do YY")}
                </p>
                <p className={style.songsCard__letter}>{songs?.playCount}</p>
                <div className={style.icons}>
                  <div onClick={() => toggleFavorite(songs.id)}>
                    {isFavorite(songs.id) ? (
                      <FavoriteIcon style={{ color: "#EE10B0" }} />
                    ) : (
                      <FavoriteBorderIcon style={{ color: "#EE10B0" }} />
                    )}
                  </div>
                  <p>{formatDuration(songs?.duration)}</p>
                  <div
                    className={style.icon}
                    onClick={() => handlePlayMusic(songs)}
                  >
                    {currentSong?.id === songs.id && isPlaying ? (
                      <PauseIcon style={{ color: "#fff" }} />
                    ) : (
                      <PlayArrowIcon style={{ color: "#fff" }} />
                    )}
                  </div>
                  <div onClick={(e) => handleMenuClick(e, songs.id)}>
                    <MoreVertIcon />
                  </div>

                  <Menu
                    anchorEl={anchorEl}
                    open={currentSongId === songs.id}
                    onClose={handleMenuClose}
                  >
                    <MenuItem>
                      <input
                        type="text"
                        placeholder="Find playlist"
                        className={style.playlistInput}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </MenuItem>
                    {filteredData?.length > 0 &&
                      filteredData?.collaborators?.length === 0 &&
                      filteredData?.map((playlist) => (
                        <MenuItem
                          onClick={() =>
                            handleAddTrack(playlist?.id, songs?.id, songs?.type)
                          }
                          key={playlist.id}
                        >
                          {playlist.name}
                        </MenuItem>
                      ))}
                    <MenuItem>
                      <NewPlaylist />
                    </MenuItem>
                  </Menu>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className={style.sentence}>Not found premium songs</p>
        )}
      </section>
    </>
  );
};

export default PremiumTracks;
