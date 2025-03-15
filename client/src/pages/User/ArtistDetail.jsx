import axios from "axios";
import style from "../../assets/style/user/artistDetail.module.scss";
import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router";
import { BASE_URL, ENDPOINT } from "../../api/endpoint";
import { getUserFromStorage } from "../../utils/localeStorage";
import { useAllTracks } from "../../hooks/useTrack";
import moment from "moment";
import { fetchUserByToken, formatDuration } from "../../utils/reusableFunc";
import Grid from "@mui/material/Grid";
import AddIcon from "@mui/icons-material/Add";
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
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import { Helmet } from "react-helmet-async";

const ArtistDetail = () => {
  const { id } = useParams();
  const [artist, setArtist] = useState([]);
  const [artistSongs, setArtistSongs] = useState([]);
  const [artistAlbum, setArtistAlbums] = useState([]);
  const [singleSongs, setSingleSongs] = useState([]);
  const { data: albums } = useAllAlbums();
  const { data: tracks } = useAllTracks();
  const [favorites, setFavorites] = useState([]);
  const token = getUserFromStorage();
  const { data: playlists } = useFetchALlPlaylistsByUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState(playlists);
  const [user, setUser] = useState([]);
  const [isFollowing, setIsFollowing] = useState(
    user?.following.includes(artist?.id)
  );

  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  //get user by id
  useEffect(() => {
    const handlegetArtistById = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL + ENDPOINT.artists}/artistDetail/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = response?.data?.data;
        setArtist(data);
      } catch (error) {
        console.log("Error: ", error);
      }
    };
    handlegetArtistById();
  }, [id, token]);

  //----------------------------------------------------
  //popular songs
  useEffect(() => {
    if (
      artist &&
      artist?.trackIds &&
      artist?.trackIds.length > 0 &&
      tracks?.length > 0
    ) {
      const trackIds = tracks?.filter((track) =>
        artist?.trackIds?.includes(track.id)
      );

      if (trackIds?.length > 0) {
        const sortedTracks = [...trackIds].sort(
          (a, b) => b.playCount - a.playCount
        );
        const lastFiveTracks = sortedTracks.slice(0, 5);
        setArtistSongs(lastFiveTracks);
      }
    }
  }, [artist, tracks]);

  //----------------------------------------------------
  // albums
  useEffect(() => {
    if (
      artist &&
      artist?.albumIds &&
      artist?.albumIds.length > 0 &&
      albums?.length > 0
    ) {
      const albumIds = albums?.filter((album) =>
        artist?.albumIds?.includes(album?.id)
      );
      setArtistAlbums(albumIds);
    }
  }, [artist, albums]);

  //----------------------------------------------------
  //single songs
  useEffect(() => {
    if (
      artist &&
      artist?.trackIds &&
      artist?.trackIds?.length > 0 &&
      tracks?.length > 0
    ) {
      const trackIds = tracks?.filter((track) =>
        artist?.trackIds?.includes(track?.id)
      );
      const single =
        trackIds?.length > 0 &&
        trackIds?.filter((track) => track?.type === "single");
      if (single?.length > 0) {
        const lastFiveTracks = single.slice(0, 5);

        setSingleSongs(lastFiveTracks);
      }
    }
  }, [artist, tracks]);

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
      await axios.patch(`${BASE_URL + ENDPOINT.tracks}/${id}/increment-play`);
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  //---------------------------------------------------
  //get user by token

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

  //----------------------------------------------------
  const handleAddTrack = async (playlistId, songId, songType) => {
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

  const addToFollow = async (artistId) => {
    try {
      setIsFollowing(true);
      await axios.patch(
        `${BASE_URL + ENDPOINT.users}/following/${artistId}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Artist added to following list!");
    } catch (error) {
      setIsFollowing(false);
      console.log("Error:", error.response?.data?.message || error.message);
    }
  };

  return (
    <>
      <Helmet>
        <title>Artist Detail</title>
      </Helmet>
      <section className={style.aboutArtist}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
            <div className={style.profileImgBox}>
              <img
                className={style.profileImg}
                src={artist?.image}
                alt="profile image"
              />
            </div>
          </Grid>
          <Grid item xs={12} sm={12} md={8} lg={8} xl={8}>
            <div className={style.text}>
              <div className={style.artistInfo}>
                <p className={style.username}>{artist?.username}</p>
                <button
                  disabled={isFollowing}
                  onClick={() => addToFollow(artist?.id)}
                  className={style.followBtn}
                >
                  {isFollowing ? "Following" : "Follow"}
                </button>
              </div>
              <p className={style.description}>{artist?.description}</p>
            </div>
          </Grid>
        </Grid>
      </section>

      <section className={style.popular}>
        <p className={style.heading}>Popular:</p>
        {artistSongs?.length > 0 &&
          artistSongs?.map((songs, index) => (
            <div
              className={`${style.box} ${
                user?.isPremium === false && songs?.premiumOnly === true
                  ? style.disabledCard
                  : ""
              }`}
              key={songs.id}
            >
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
            </div>
          ))}
      </section>

      <section className={style.allAlbums}>
        <p className={style.heading}>
          Artist`s <span style={{ color: "#EE10B0" }}>Albums</span> :{" "}
        </p>
        <div className={style.albums}>
          {artistAlbum?.length > 0 ? (
            artistAlbum.map((album) => (
              <Link to={`/album/${album?.id}`} key={album?.id}>
                <div className={style.card}>
                  <div className={style.imgBox}>
                    <img
                      className={style.img}
                      src={album.coverImage}
                      alt="coverImage"
                    />
                  </div>
                  <p className={style.letterTop}>{album.name}</p>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <p className={style.letterBottom}>
                      Songs: {album.trackCount}
                    </p>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p className={style.sentence}>Albums not found</p>
          )}
          <Link to={`/artist-all-albums/${artist?.id}`}>
            <div className={style.viewAll}>
              <div className={style.circle}>
                <AddIcon
                  style={{
                    color: "#fff",
                    fontSize: "35px",
                    position: "absolute",
                    left: "22px",
                    bottom: "25px",
                  }}
                />
              </div>
              <p style={{ fontSize: "16px" }}>View All</p>
            </div>
          </Link>
        </div>
      </section>

      <section className={style.allSingleSongs}>
        <p className={style.heading}>
          Single <span style={{ color: "#EE10B0" }}>Songs</span> :{" "}
        </p>
        <div className={style.songs}>
          {singleSongs?.length > 0 ? (
            singleSongs?.map((songs) => (
              <div
                className={`${style.card} ${
                  user?.isPremium === false && songs?.premiumOnly === true
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
            <p className={style.sentence}>You don`t have any albums</p>
          )}
          <Link to={`/all-single-songs/${artist?.id}`}>
            <div className={style.viewAll}>
              <div className={style.circle}>
                <AddIcon
                  style={{
                    color: "#fff",
                    fontSize: "35px",
                    position: "absolute",
                    left: "22px",
                    bottom: "25px",
                  }}
                />
              </div>
              <p style={{ fontSize: "16px" }}>View All</p>
            </div>
          </Link>
        </div>
      </section>
    </>
  );
};

export default ArtistDetail;
