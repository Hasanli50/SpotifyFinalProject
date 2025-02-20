import { useEffect, useState, useRef } from "react";
// import { useAllAlbums } from "../../hooks/useAlbum";
import { useAllTracks } from "../../hooks/useTrack";
import style from "../../assets/style/user/home.module.scss";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import moment from "moment";
import axios from "axios";
import { BASE_URL, ENDPOINT } from "../../api/endpoint";
import { Link } from "react-router";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";

const WeeklySongs = () => {
  const [topSongs, setTopSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const { data: tracks } = useAllTracks();

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

      setTopSongs(sortedTracks);
    }
  }, [tracks]);

  return (
    <>
      <section className={style.topSongs}>
        <p className={style.heading}>
          <Link to={"/"}>
            <span className={style.back}>
              <KeyboardBackspaceIcon style={{ fontSize: "28px" }} />
            </span>
          </Link>
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
        </div>
      </section>
    </>
  );
};

export default WeeklySongs;
