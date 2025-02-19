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
    console.log("songs: ", songs);
  }, [favorites, tracks]);

  console.log("favorites: ", favorites);
  console.log("track: ", track);

  return (
    <>
      <section className={style.allSingleSongs}>
        <p className={style.heading}>Favorites:</p>

        {track?.length > 0 ? (
          track.map((songs, index) => (
            <div className={style.box} key={songs.id}>
              <p className={style.place}>#{index + 1}</p>
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
                  <div onClick={() => toggleFavorite(songs?.id)}>
                    <FavoriteIcon style={{ color: "#EE10B0" }} />
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
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </MenuItem>
                    {filteredData.length > 0 &&
                      filteredData.map((playlist) => (
                        <MenuItem key={playlist.id}>{playlist.name}</MenuItem>
                      ))}
                    <MenuItem>
                      <NewPlaylist />
                    </MenuItem>
                    <MenuItem onClick={handleMenuClose}>
                      + New Playlist With Collaborator
                    </MenuItem>
                  </Menu>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className={style.sentence}>You don`t favorite songs</p>
        )}
      </section>
    </>
  );
};

export default Favorites;
