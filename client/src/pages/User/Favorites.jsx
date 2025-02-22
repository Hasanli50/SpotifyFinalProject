import axios from "axios";
import style from "../../assets/style/user/artistSongs.module.scss";
import { useEffect, useRef, useState } from "react";
import { BASE_URL, ENDPOINT } from "../../api/endpoint";
import { getUserFromStorage } from "../../utils/localeStorage";
import moment from "moment";
import { fetchUserByToken } from "../../utils/reusableFunc";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Menu, MenuItem } from "@mui/material";
import NewPlaylist from "../../components/user/NewPlaylist";
import { useFetchALlPlaylistsByUser } from "../../hooks/usePlaylist";
import { useAllTracks } from "../../hooks/useTrack";
import NewPlaylistwithCollab from "../../components/user/NewPlaylistwithCollab";
import toast from "react-hot-toast";
import SearchIcon from "@mui/icons-material/Search";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";

const Favorites = () => {
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const [favorites, setFavorites] = useState([]);
  const token = getUserFromStorage();
  const { data: playlists } = useFetchALlPlaylistsByUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState(playlists);
  const [track, setTrack] = useState([]);
  const { data: tracks } = useAllTracks();

  const [searchSong, setSearchSong] = useState("");
  const [filterSong, setFilterSong] = useState(track);

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

  //----------------------------------------------------
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

  //----------------------------------------------------
  useEffect(() => {
    const data = playlists?.filter((value) =>
      value.name.trim().toLowerCase().includes(searchQuery.trim().toLowerCase())
    );
    setFilteredData(data);
  }, [playlists, searchQuery]);

  //----------------------------------------------------
  useEffect(() => {
    const songs = favorites
      ?.map((songId) => {
        return tracks?.find((track) => track.id === songId);
      })
      .filter((track) => track !== undefined);

    setTrack(songs);
  }, [favorites, tracks]);

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

  useEffect(() => {
    const songs = track?.filter(
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
    setFilterSong(songs);
  }, [track, searchSong]);

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

        <p className={style.heading}>Favorites:</p>

        <div className={style.songs}>
          {filterSong?.length > 0 ? (
            filterSong?.map((songs) => (
              <div
                className={`${style.card} ${
                  user?.isPremium === false && songs.premiumOnly === true
                    ? style.disabledCard
                    : ""
                }`}
                key={songs.id}
              >
                <div className={style.imgBox}>
                  <img
                    className={style.img}
                    src={songs.coverImage}
                    alt="coverImage"
                  />
                  <WorkspacePremiumIcon
                    className={style.premium}
                    style={{ display: songs.premiumOnly ? "block" : "none" }}
                  />
                  <div className={style.icons}>
                    <div onClick={() => toggleFavorite(songs.id)}>
                      <FavoriteIcon style={{ color: "#EE10B0" }} />
                    </div>
                    <div onClick={(e) => handleMenuClick(e, songs.id)}>
                      <MoreVertIcon />
                    </div>

                    <Menu
                      className={style.menu}
                      anchorEl={anchorEl}
                      open={currentSongId === songs.id}
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
                        filteredData?.map((playlist) => (
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
                        ))}
                      <MenuItem>
                        <NewPlaylist />
                      </MenuItem>
                      {user?.isPremium === false ||
                      songs.premiumOnly === true ? (
                        ""
                      ) : (
                        <MenuItem>
                          <NewPlaylistwithCollab />
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
                    {currentSong?.id === songs.id && isPlaying ? (
                      <PauseIcon style={{ color: "#fff" }} />
                    ) : (
                      <PlayArrowIcon style={{ color: "#fff" }} />
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className={style.sentence}>Artist dont have single songs</p>
          )}
        </div>
      </section>
    </>
  );
};

export default Favorites;
