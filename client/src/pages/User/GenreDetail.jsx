import style from "../../assets/style/user/artistSongs.module.scss";
import { Link, useParams } from "react-router";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { BASE_URL, ENDPOINT } from "../../api/endpoint";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import { getUserFromStorage } from "../../utils/localeStorage";
import { useFetchALlPlaylistsByUser } from "../../hooks/usePlaylist";
import SearchIcon from "@mui/icons-material/Search";
import moment from "moment";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Menu, MenuItem } from "@mui/material";
import NewPlaylist from "../../components/user/NewPlaylist";
import NewPlaylistwithCollab from "../../components/user/NewPlaylistwithCollab";
import toast from "react-hot-toast";
import { fetchUserByToken } from "../../utils/reusableFunc";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";

const GenreDetail = () => {
  const { id } = useParams();
  const [genre, setGenre] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchSong, setSearchSong] = useState("");
  const [favorites, setFavorites] = useState([]);
  const token = getUserFromStorage();
  const { data: playlists } = useFetchALlPlaylistsByUser();
  const [filteredData, setFilteredData] = useState(playlists);
  const [filteredSong, setFilteredSong] = useState([tracks]);

  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const hadleGetGenreById = async () => {
      try {
        const response = await axios.get(`${BASE_URL + ENDPOINT.genres}/${id}`);
        setGenre(response.data.data);
      } catch (error) {
        console.log("Error: ", error.response?.message || error.message);
      }
    };
    hadleGetGenreById();
  }, [id]);

  useEffect(() => {
    const handleGetTrack = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL + ENDPOINT.genres}/${id}/tracks`
        );
        setTracks(response.data.data);
      } catch (error) {
        console.log("Error: ", error);
      }
    };
    handleGetTrack();
  }, [id]);

  //----------------------------------------------------
  const handlePlayMusic = (song) => {
    if (currentSong && currentSong?.id === song?.id) {
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
      audioRef.current = new Audio(song?.previewUrl);
      audioRef.current.play();
      setIsPlaying(true);

      handlePlayCount(song?.id);
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

  //---------------------------------------------------
  //get user by token
  const [user, setUser] = useState([]);

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
    setFilteredData(playlists);
  }, [playlists]);

  //----------------------------------------------------

  useEffect(() => {
    const savedFavorites =
      JSON.parse(localStorage.getItem(`userFavorites_${user?.id}`)) || [];
    setFavorites(savedFavorites);
  }, [user.id]);

  const toggleFavorite = (songId) => {
    let updatedFavorites = [...favorites];

    if (updatedFavorites.includes(songId)) {
      updatedFavorites = updatedFavorites?.filter((id) => id !== songId);
    } else {
      updatedFavorites.push(songId);
    }

    setFavorites(updatedFavorites);

    localStorage.setItem(
      `userFavorites_${user?.id}`,
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
      value?.name
        ?.trim()
        .toLowerCase()
        .includes(searchQuery.trim().toLowerCase())
    );
    setFilteredData(data);
  }, [playlists, searchQuery]);

  useEffect(() => {
    const song = tracks?.filter((value) =>
      value?.name
        ?.trim()
        .toLowerCase()
        .includes(searchSong.trim().toLowerCase())
    );
    setFilteredSong(song);
  }, [tracks, searchSong]);

  //----------------------------------------------------
  const handleAddTrack = async (playlistId, songId, songType) => {
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

  const handleCreateNewPlaylist = (newPlaylist) => {
    setFilteredData((prevData) => [...prevData, newPlaylist]);
  };

  return (
    <>
      <div className={style.inputBox}>
        <input
          onChange={(e) => setSearchSong(e.target.value)}
          type="text"
          value={searchSong}
          className={style.input}
          placeholder="Search for songs..."
        />
        <SearchIcon className={style.searchIcon} />
      </div>
      <section className={style.allSingleSongs}>
        <p className={style.heading}>
          <Link to={`/discover`}>
            <span className={style.back}>
              <KeyboardBackspaceIcon style={{ fontSize: "28px" }} />
            </span>
          </Link>
          <span style={{ color: "#EE10B0" }}>{genre.name}</span> :{" "}
        </p>

        <div className={style.songs}>
          {filteredSong?.length > 0 ? (
            filteredSong?.map((songs) => (
              <div
                className={`${style.card} ${
                  user?.isPremium === false && songs?.premiumOnly === true
                    ? style.disabledCard
                    : ""
                }`}
                key={songs?.id}
              >
                <div className={style.imgBox}>
                  <img
                    className={style.img}
                    src={songs.coverImage}
                    alt="coverImage"
                  />
                  <WorkspacePremiumIcon
                    className={style.premium}
                    style={{ display: songs?.premiumOnly ? "block" : "none" }}
                  />
                  <div className={style.icons}>
                    <div onClick={() => toggleFavorite(songs.id)}>
                      {isFavorite(songs?.id) ? (
                        <FavoriteIcon style={{ color: "#EE10B0" }} />
                      ) : (
                        <FavoriteBorderIcon style={{ color: "#EE10B0" }} />
                      )}
                    </div>
                    <div onClick={(e) => handleMenuClick(e, songs.id)}>
                      <MoreVertIcon />
                    </div>

                    <Menu
                      className={style.menu}
                      anchorEl={anchorEl}
                      open={currentSongId === songs?.id}
                      onClose={handleMenuClose}
                    >
                      <MenuItem>
                        <input
                          className={style.playlistInput}
                          type="text"
                          placeholder="Find playlist"
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </MenuItem>
                      {filteredData?.length > 0 &&
                        filteredData?.map((playlist) => {
                          const isCollaborator =
                            playlist?.collaborators?.includes(user?.id);
                          if (
                            playlist?.userId === user?.id ||
                            (isCollaborator && user?.isPremium)
                          ) {
                            return (
                              <MenuItem
                                onClick={() =>
                                  handleAddTrack(
                                    playlist?.id,
                                    songs?.id,
                                    songs?.type
                                  )
                                }
                                key={playlist.id}
                              >
                                {playlist.name}
                              </MenuItem>
                            );
                          }
                          return null;
                        })}
                      <MenuItem>
                        <NewPlaylist
                          handleCreateNewPlaylist={handleCreateNewPlaylist}
                        />
                      </MenuItem>
                      {user?.isPremium === false ||
                      songs?.premiumOnly === true ? (
                        ""
                      ) : (
                        <MenuItem>
                          <NewPlaylistwithCollab
                            handleCreateNewPlaylist={handleCreateNewPlaylist}
                          />
                        </MenuItem>
                      )}
                    </Menu>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <p className={style.letterTop}>{songs.name}</p>
                    <p className={style.letterBottom}>
                      {moment(songs.createdAt).format("MMM Do YY")}
                    </p>
                  </div>
                  <div
                    className={style.icon}
                    onClick={() => handlePlayMusic(songs)}
                  >
                    {currentSong?.id === songs?.id && isPlaying ? (
                      <PauseIcon style={{ color: "#fff" }} />
                    ) : (
                      <PlayArrowIcon style={{ color: "#fff" }} />
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className={style.sentence}>Songs not found :(</p>
          )}
        </div>
      </section>
    </>
  );
};

export default GenreDetail;
