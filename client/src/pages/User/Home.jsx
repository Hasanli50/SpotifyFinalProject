import { useEffect, useState, useRef } from "react";
// import { useAllAlbums } from "../../hooks/useAlbum";
import { useAllTracks } from "../../hooks/useTrack";
import style from "../../assets/style/user/home.module.scss";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import AddIcon from "@mui/icons-material/Add";
import { Link } from "react-router";
import moment from "moment";
import { formatDuration } from "../../utils/reusableFunc";
import axios from "axios";
import { BASE_URL, ENDPOINT } from "../../api/endpoint";
import { useAllNonDeletedArtists } from "../../hooks/useArtist";

const Home = () => {
  const [artists, setArtists] = useState([]);
  const [newSongs, setNewSongs] = useState([]);
  const [topSongs, setTopSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const [trendingSongs, setTrendingSongs] = useState([]);

  // const { data } = useAllAlbums();
  const { data: tracks } = useAllTracks();
  const { data } = useAllNonDeletedArtists();

  // new releas songs
  useEffect(() => {
    if (tracks?.length > 0) {
      const sortedTracks = [...tracks].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      const lastFiveTracks = sortedTracks.slice(0, 3);
      setNewSongs(lastFiveTracks);
    }
  }, [tracks]);

  useEffect(() => {
    if (data?.length > 0) {
      const lastFiveTracks = data.slice(0, 5);
      setArtists(lastFiveTracks);
    }
  }, [data]);

  //trending songs
  useEffect(() => {
    if (tracks?.length > 0) {
      const sortedTracks = [...tracks].sort(
        (a, b) => b.playCount - a.playCount
      );

      const lastFiveTracks = sortedTracks.slice(0, 5);
      setTrendingSongs(lastFiveTracks);
      console.log(tracks);
    }
  }, [tracks]);

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

  const currentDate = moment();
  const startOfWeek = currentDate.startOf("week");
  //top songs
  useEffect(() => {
    if (tracks?.length > 0) {
      const tracksPlayedThisWeek = tracks.filter((track) => {
        const trackCreatedAt = moment(track.createdAt);
        return trackCreatedAt.isAfter(startOfWeek);
      });

      const sortedTracks = tracksPlayedThisWeek.sort(
        (a, b) => b.playCount - a.playCount
      );

      const topFiveTracks = sortedTracks.slice(0, 5);

      setTopSongs(topFiveTracks);
      console.log(topFiveTracks);
    }
  }, [tracks]);

  return (
    <>
      <section className={style.topSongs}>
        <p className={style.heading}>
          Weekly Top <span style={{ color: "#EE10B0" }}>Songs</span> :{" "}
        </p>
        <div
          style={{
            display: "flex",
            gap: "40px",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          {topSongs?.length > 0 ? (
            topSongs.map((song) => (
              <div className={style.card} key={song.id}>
                <div className={style.imgBox}>
                  <img
                    className={style.img}
                    src={song.coverImage}
                    alt="coverImage"
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
                    <p className={style.letterTop}>{song.name}</p>
                    <p className={style.letterBottom}>
                      {song.artistId.username}
                    </p>
                  </div>
                  <div
                    className={style.icon}
                    onClick={() => handlePlayMusic(song)}
                  >
                    {currentSong?.id === song.id && isPlaying ? (
                      <PauseIcon style={{ color: "#fff" }} />
                    ) : (
                      <PlayArrowIcon style={{ color: "#fff" }} />
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className={style.paragraph}>
              No top songs for this week. Check back later!
            </p>
          )}
          <Link to={"/top-songs"}>
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

      <section className={style.songs}>
        <p className={style.heading}>
          New Release <span style={{ color: "#EE10B0" }}>Songs</span> :{" "}
        </p>
        <div
          style={{
            display: "flex",
            gap: "40px",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          {newSongs?.length > 0 &&
            newSongs.map((song) => (
              <div className={style.card} key={song.id}>
                <div className={style.imgBox}>
                  <img
                    className={style.img}
                    src={song.coverImage}
                    alt="coverImage"
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
                    <p className={style.letterTop}>{song.name}</p>
                    <p className={style.letterBottom}>
                      {song.artistId.username}
                    </p>
                  </div>
                  <div
                    className={style.icon}
                    onClick={() => handlePlayMusic(song)}
                  >
                    {currentSong?.id === song.id && isPlaying ? (
                      <PauseIcon style={{ color: "#fff" }} />
                    ) : (
                      <PlayArrowIcon style={{ color: "#fff" }} />
                    )}
                  </div>
                </div>
              </div>
            ))}
          <Link to={"/new-songs"}>
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

      <section className={style.trendingSngs}>
        <p className={style.heading}>
          Trending <span style={{ color: "#EE10B0" }}>Songs</span> :{" "}
        </p>
        {trendingSongs?.length > 0 &&
          trendingSongs.map((songs, index) => (
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

                <div style={{ display: "flex", gap: "10px" }}>
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
                </div>
              </div>
            </div>
          ))}

        <Link to={"/trending-songs"}>
          <div className={style.rectangleМiewAll}>
            <div className={style.rectangle}>
              <AddIcon
                style={{
                  color: "#fff",
                  fontSize: "25px",
                }}
              />
            </div>
            <p style={{ fontSize: "16px" }}>View All</p>
          </div>
        </Link>
      </section>

      <section className={style.allArtists}>
        <p className={style.heading}>
          All <span style={{ color: "#EE10B0" }}>Artists</span> :{" "}
        </p>

        <div
          style={{
            display: "flex",
            gap: "40px",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          {artists.length > 0 &&
            artists.map((artist) => (
              <Link to={`/artists/${artist.id}`} key={artist.id}>
                <div className={style.artists}>
                  <div className={style.profileImgBox}>
                    <img
                      className={style.profileImg}
                      src={artist.image}
                      alt="profile image"
                    />
                  </div>
                  <p style={{ fontSize: "16px", color: "#fff" }}>
                    {artist.username}
                  </p>
                </div>
              </Link>
            ))}
          <Link to={"/artists"}>
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

export default Home;
