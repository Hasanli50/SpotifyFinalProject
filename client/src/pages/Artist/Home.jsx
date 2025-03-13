import style from "../../assets/style/artist/home.module.scss";
import Grid from "@mui/material/Grid";
import { getUserFromStorage } from "../../utils/localeStorage";
import { useEffect, useRef, useState } from "react";
import { fetchArtistByToken, formatDuration } from "../../utils/reusableFunc";
import { useAllAlbums } from "../../hooks/useAlbum";
import { useAllTracks } from "../../hooks/useTrack";
import moment from "moment";
import { Link } from "react-router";
import { BASE_URL, ENDPOINT } from "../../api/endpoint";
import axios from "axios";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import { Helmet } from "react-helmet-async";

const Home = () => {
  const [artist, setArtist] = useState([]);
  const [artistAlbum, setArtistAlbums] = useState([]);
  const [artistSongs, setArtistSongs] = useState([]);
  const [newSongs, setNewSongs] = useState([]);
  const [trendingSongs, setTrendingSongs] = useState([]);

  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const { data } = useAllAlbums();
  const { data: tracks } = useAllTracks();
  const token = getUserFromStorage();

  //find artist
  useEffect(() => {
    const getArtistByToken = async () => {
      try {
        const response = await fetchArtistByToken(token);
        setArtist(response);
      } catch (error) {
        console.log("Error:", error);
      }
    };
    getArtistByToken();
  }, [token]);

  // albums
  useEffect(() => {
    if (
      artist &&
      artist?.albumIds &&
      artist?.albumIds?.length > 0 &&
      data?.length > 0
    ) {
      const albumIds = data?.filter((album) =>
        artist?.albumIds?.includes(album.id)
      );
      if (albumIds.length > 0) {
        const sortedAlbums = [...albumIds].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        const lastFiveAlbums = sortedAlbums.slice(0, 5);
        setArtistAlbums(lastFiveAlbums);
      }
    }
  }, [artist, data]);

  //top songs
  useEffect(() => {
    if (
      artist &&
      artist?.trackIds &&
      artist?.trackIds?.length > 0 &&
      tracks?.length > 0
    ) {
      const trackIds = tracks?.filter((track) =>
        artist?.trackIds?.includes(track.id)
      );
      const single =
        trackIds?.length > 0 &&
        trackIds?.filter((track) => track?.type === "single");
      if (single?.length > 0) {
        const sortedTracks = [...single].sort(
          (a, b) => b.playCount - a.playCount
        );
        const lastFiveTracks = sortedTracks.slice(0, 5);
        setArtistSongs(lastFiveTracks);
      }
    }
  }, [artist, tracks]);

  //new relwase songs
  useEffect(() => {
    if (tracks?.length > 0) {
      const sortedTracks = [...tracks].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      const lastFiveTracks = sortedTracks.slice(0, 5);
      setNewSongs(lastFiveTracks);
    }
  }, [tracks]);

  //trending songs
  useEffect(() => {
    if (tracks?.length > 0) {
      const sortedTracks = [...tracks].sort(
        (a, b) => b.playCount - a.playCount
      );

      const lastFiveTracks = sortedTracks.slice(0, 5);
      setTrendingSongs(lastFiveTracks);
    }
  }, [tracks]);

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

  //----------------------------------------------------
  //increment playcount
  const handlePlayCount = async (id) => {
    try {
      await axios.patch(`${BASE_URL + ENDPOINT.tracks}/${id}/increment-play`);
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  return (
    <>
      <Helmet>
        <title>Home</title>
      </Helmet>
      <main className={style.main}>
        <section className={style.albums}>
          <p className={style.heading}>
            Your Last <span style={{ color: "#EE10B0" }}>Albums</span> :{" "}
          </p>
          <Grid container spacing={7}>
            {artistAlbum?.length > 0 ? (
              artistAlbum?.map((album) => (
                <Grid item xs={12} sm={6} md={4} lg={3} xl={3} key={album?.id}>
                  <Link to={`/artist/add-track/${album?.id}`}>
                    <div className={style.card}>
                      <div className={style.imgBox}>
                        <img
                          className={style.img}
                          src={album.coverImage}
                          alt="coverImage"
                        />
                      </div>
                      <p className={style.letterTop}>{album.name}</p>
                      <p className={style.letterBottom}>
                        Songs: {album.trackCount}
                      </p>
                    </div>
                  </Link>
                </Grid>
              ))
            ) : (
              <p className={style.sentence}>You don`t have any albums</p>
            )}
          </Grid>
        </section>

        <section className={style.singles}>
          <p className={style.heading}>
            Top <span style={{ color: "#EE10B0" }}>Singles</span> :{" "}
          </p>
          {artistSongs?.length > 0 ? (
            <Grid container spacing={7}>
              {artistSongs?.map((songs) => (
                <Grid item xs={12} sm={6} md={4} lg={3} xl={3} key={songs.id}>
                  <div className={style.card}>
                    <div className={style.imgBox}>
                      <img
                        className={style.img}
                        src={songs?.coverImage}
                        alt="image"
                      />
                      <div className={style.iconBox}>
                        <WorkspacePremiumIcon
                          className={style.premium}
                          style={{
                            display: songs?.premiumOnly ? "block" : "none",
                          }}
                        />
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
                        <p className={style.letterBottom}>{songs.playCount}</p>
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
                </Grid>
              ))}
            </Grid>
          ) : (
            <p className={style.sentence}>You don`t have any singles</p>
          )}
        </section>

        <section className={style.songs}>
          <p className={style.heading}>
            New Release <span style={{ color: "#EE10B0" }}>Songs</span> :{" "}
          </p>
          <Grid container spacing={7}>
            {newSongs?.length > 0 &&
              newSongs?.map((songs) => (
                <Grid item xs={12} sm={6} md={4} lg={3} xl={3} key={songs.id}>
                  <div className={style.card}>
                    <div className={style.imgBox}>
                      <img
                        className={style.img}
                        src={songs.coverImage}
                        alt="coverImage"
                      />
                      <div className={style.iconBox}>
                        <WorkspacePremiumIcon
                          className={style.premium}
                          style={{
                            display: songs.premiumOnly ? "block" : "none",
                          }}
                        />
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
                </Grid>
              ))}
          </Grid>
        </section>

        <section className={style.trendingSngs}>
          <p className={style.heading}>
            Trending <span style={{ color: "#EE10B0" }}>Songs</span> :{" "}
          </p>
          {trendingSongs?.length > 0 &&
            trendingSongs?.map((songs, index) => (
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
                      <WorkspacePremiumIcon
                        className={style.premiumMini}
                        style={{
                          display: songs.premiumOnly ? "block" : "none",
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
                  <p className={style.songsCard__letter}>
                    {songs.albumId === null ? "Single" : songs.albumId.name}
                  </p>

                  <div
                    style={{
                      display: "flex",
                      // alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <p>{formatDuration(songs.duration)}</p>
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
              </div>
            ))}
        </section>
      </main>
    </>
  );
};

export default Home;
