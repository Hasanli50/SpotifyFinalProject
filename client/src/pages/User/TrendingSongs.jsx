import { useEffect, useState, useRef } from "react";
import { useAllTracks } from "../../hooks/useTrack";
import style from "../../assets/style/user/home.module.scss";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import moment from "moment";
import { fetchUserByToken, formatDuration } from "../../utils/reusableFunc";
import axios from "axios";
import { BASE_URL, ENDPOINT } from "../../api/endpoint";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { Link } from "react-router";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import { getUserFromStorage } from "../../utils/localeStorage";

const TrendingSongs = () => {
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const [trendingSongs, setTrendingSongs] = useState([]);
  const { data: tracks } = useAllTracks();

  //get user by token
  const [user, setUser] = useState([]);

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

  //trending songs
  useEffect(() => {
    if (tracks?.length > 0) {
      const sortedTracks = [...tracks].sort(
        (a, b) => b.playCount - a.playCount
      );

      const lastTwentyTracks = sortedTracks.slice(0, 20);
      setTrendingSongs(lastTwentyTracks);
    }
  }, [tracks]);

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

  return (
    <>
      <section className={style.trendingSngs}>
        <p className={style.heading}>
          <Link to={"/"}>
            <span className={style.back}>
              <KeyboardBackspaceIcon style={{ fontSize: "28px" }} />
            </span>
          </Link>
          Trending <span style={{ color: "#EE10B0" }}>Songs</span> :{" "}
        </p>
        {trendingSongs?.length > 0 &&
          trendingSongs?.map((songs, index) => (
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
                <p className={style.songsCard__letter}>
                  {songs?.albumId === null ? "Single" : songs?.albumId?.name}
                </p>

                <div style={{ display: "flex", gap: "10px" }}>
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
    </>
  );
};

export default TrendingSongs;
