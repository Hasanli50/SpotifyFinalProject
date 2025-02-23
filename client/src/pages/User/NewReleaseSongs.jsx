import { useEffect, useState, useRef } from "react";
// import { useAllAlbums } from "../../hooks/useAlbum";
import { useAllTracks } from "../../hooks/useTrack";
import style from "../../assets/style/user/home.module.scss";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { Link } from "react-router";
import axios from "axios";
import { BASE_URL, ENDPOINT } from "../../api/endpoint";
import moment from "moment";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { fetchUserByToken } from "../../utils/reusableFunc";
import { getUserFromStorage } from "../../utils/localeStorage";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";

const NewReleaseSongs = () => {
  const [newSongs, setNewSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
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

  // new releas songs
  const currentDate = moment();
  const startOfWeek = currentDate.startOf("month");

  useEffect(() => {
    if (tracks?.length > 0) {
      const tracksPlayedThisMonth = tracks.filter((track) => {
        const trackCreatedAt = moment(track.createdAt);
        return trackCreatedAt.isAfter(startOfWeek);
      });
      const sortedTracks = [...tracksPlayedThisMonth].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setNewSongs(sortedTracks);
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
  return (
    <>
      <section className={style.songs}>
        <p className={style.heading}>
          <Link to={"/"}>
            <span className={style.back}>
              <KeyboardBackspaceIcon style={{ fontSize: "28px" }} />
            </span>
          </Link>
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
              <div
                className={`${style.card} ${
                  user?.isPremium === false && song.premiumOnly === true
                    ? style.disabledCard
                    : ""
                }`}
                key={song.id}
              >
                <div className={style.imgBox}>
                  <img
                    className={style.img}
                    src={song.coverImage}
                    alt="coverImage"
                  />
                  <WorkspacePremiumIcon
                    className={style.premium}
                    style={{ display: song.premiumOnly ? "block" : "none" }}
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
        </div>
      </section>
    </>
  );
};

export default NewReleaseSongs;
