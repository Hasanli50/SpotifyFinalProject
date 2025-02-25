import axios from "axios";
import style from "../../assets/style/user/albumDetail.module.scss";
import { useEffect, useRef, useState } from "react";
import { BASE_URL, ENDPOINT } from "../../api/endpoint";
import { getUserFromStorage } from "../../utils/localeStorage";
import { useAllTracks } from "../../hooks/useTrack";
import moment from "moment";
import { fetchUserByToken, formatDuration } from "../../utils/reusableFunc";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useAllAlbums } from "../../hooks/useAlbum";
import { Menu, MenuItem } from "@mui/material";
import NewPlaylist from "../../components/user/NewPlaylist";
import { useFetchALlPlaylistsByUser } from "../../hooks/usePlaylist";
import NewPlaylistwithCollab from "../../components/user/NewPlaylistwithCollab";
import toast from "react-hot-toast";
import { useAllNonDeletedArtists } from "../../hooks/useArtist";
import { Link, useParams } from "react-router";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";

const AlbumDetail = () => {
  const { id } = useParams();
  const [album, setAlbum] = useState([]);
  const [artist, setArtist] = useState([]);
  const [songs, setSongs] = useState([]);
  const { data: albums } = useAllAlbums();
  const { data: tracks } = useAllTracks();
  const { data: artists } = useAllNonDeletedArtists();
  const [favorites, setFavorites] = useState([]);
  const token = getUserFromStorage();
  const { data: playlists } = useFetchALlPlaylistsByUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState(playlists);

  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  // album
  useEffect(() => {
    if (albums?.length > 0) {
      const albumId = albums?.find((a) => a?.id === id);
      setAlbum(albumId);
    }
  }, [albums, id]);

  // find artist
  useEffect(() => {
    if (album?.artistId && artists?.length > 0) {
      const artistObj = artists?.find((user) => user?.id === album?.artistId);
      setArtist(artistObj);
      console.log(artistObj);
    }
  }, [album, artists]);

  //----------------------------------------------------
  //single songs
  useEffect(() => {
    if (
      album &&
      album?.trackIds &&
      album?.trackIds?.length > 0 &&
      tracks?.length > 0
    ) {
      const trackIds = tracks?.filter((track) =>
        album?.trackIds?.includes(track?.id)
      );
      setSongs(trackIds);
    }
  }, [album, tracks]);

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
      updatedFavorites = updatedFavorites?.filter((id) => id !== songId);
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
      value?.name?.trim().toLowerCase().includes(searchQuery.trim().toLowerCase())
    );
    setFilteredData(data);
  }, [playlists, searchQuery]);

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

  return (
    <>
      <section className={style.album}>
        <Link to={`/artists/${album?.artistId?._id || artist?.id}`}>
          <span className={style.back}>
            <KeyboardBackspaceIcon style={{ fontSize: "28px" }} />
          </span>
        </Link>
        <div className={style.profileImgBox}>
          <img
            className={style.profileImg}
            src={album?.coverImage}
            alt="cover image"
          />
        </div>
        <div className={style.text}>
          <p className={style.username}>
            Album: <span style={{ color: "#fff" }}>{album?.name}</span>
          </p>
          <p className={style.username}>
            Artist :{" "}
            <span style={{ color: "#fff" }}>
              {" "}
              {album?.artistId?.username || artist?.username}
            </span>
          </p>
          <p className={style.songsCount}>
            Songs:{" "}
            <span style={{ color: "#fff" }}>{album?.trackIds?.length}</span>{" "}
          </p>
        </div>
      </section>

      <section className={style.songs}>
        <p className={style.heading}>Songs:</p>
        {songs?.length > 0 &&
          songs.map((songs, index) => (
            <div
              className={`${style.box} ${
                user?.isPremium === false && songs?.premiumOnly === true
                  ? style.disabledCard
                  : ""
              }`}
              key={songs.id}
            >
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
                    <WorkspacePremiumIcon
                      className={style.premiumMini}
                      style={{
                        display: songs.premiumOnly ? "block" : "none",
                        fontSize: "18px",
                      }}
                    />
                  </div>
                  <div>
                    <p className={style.letterTop}>{songs.name}</p>
                    <p className={style.letterBottom}>
                      {songs.artistId.username}
                    </p>
                  </div>
                </div>

                <p className={style.songsCard__letter}>
                  {moment(songs.createdAt).format("MMM Do YY")}
                </p>
                <p className={style.songsCard__letter}>{songs.playCount}</p>
                <div className={style.icons}>
                  <div onClick={() => toggleFavorite(songs.id)}>
                    {isFavorite(songs.id) ? (
                      <FavoriteIcon style={{ color: "#EE10B0" }} />
                    ) : (
                      <FavoriteBorderIcon style={{ color: "#EE10B0" }} />
                    )}
                  </div>
                  <p>{formatDuration(songs.duration)}</p>
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
                    {user?.isPremium === false || songs?.premiumOnly === true ? (
                      ""
                    ) : (
                      <MenuItem>
                        <NewPlaylistwithCollab />
                      </MenuItem>
                    )}
                  </Menu>
                </div>
              </div>
            </div>
          ))}
      </section>
    </>
  );
};

export default AlbumDetail;
