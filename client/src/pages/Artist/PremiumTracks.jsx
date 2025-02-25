import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { useAllTracks } from "../../hooks/useTrack";
import { getUserFromStorage } from "../../utils/localeStorage";
import { fetchArtistByToken } from "../../utils/reusableFunc";
import style from "../../assets/style/artist/premiumTracks.module.scss";
import axios from "axios";
import { BASE_URL, ENDPOINT } from "../../api/endpoint";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";

const PremiumTracks = () => {
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const [artist, setArtist] = useState([]);
  const [tracks, setTracks] = useState([]);
  const { data } = useAllTracks();

  const token = getUserFromStorage();

  // Fetch artist data
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

  // Filter artist's tracks
  useEffect(() => {
    if (artist?.trackIds?.length > 0 && data?.length > 0) {
      const trackIds = data?.filter((track) =>
        artist?.trackIds?.includes(track?.id)
      );
      const filteredData = trackIds?.filter(
        (track) => track?.premiumOnly === true
      );
      setTracks(filteredData);
    }
  }, [artist, data]);

  const handleChangePremiumToFree = async (id) => {
    try {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, change it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await axios.patch(
            `${BASE_URL + ENDPOINT.tracks}/${id}/premium-only`,
            { premiumOnly: false }
          );
          const updatedTracks = tracks?.filter((song) => song?.id !== id);
          setTracks(updatedTracks);
          Swal.fire({
            title: "Updated!",
            text: "The track is now free.",
            icon: "success",
          });
        }
      });
    } catch (error) {
      console.log("Error: ", error);
      toast.error("Failed to change premium to free. Please try again.");
    }
  };

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

  return (
    <section className={style.premiumTracks}>
      <p className={style.heading}>Premium Tracks: </p>
      <div className={style.songs}>
        {tracks?.length > 0 ? (
          tracks?.map((song, index) => (
            <div className={style.songBox} key={song.id}>
              <p className={style.place}>{index + 1}.</p>
              <div className={style.songsCard}>
                <div
                  style={{ display: "flex", gap: "7px", alignItems: "center" }}
                >
                  <div className={style.songsCard__imgBox}>
                    <img
                      className={style.songsCard__imgBox__img}
                      src={song.coverImage}
                      alt="coverImage"
                    />
                    <WorkspacePremiumIcon
                      className={style.premiumMini}
                      style={{
                        fontSize: "18px",
                      }}
                    />
                  </div>
                  <div>
                    <p className={style.letterTop}>{song.name}</p>
                    <p className={style.letterBottom} style={{textAlign:"left"}}>
                      {song.albumId?.name || "Single"}
                    </p>
                  </div>
                </div>
                <p className={style.songsCard__letter}>
                  {song.createdAt
                    ? moment(song.createdAt).format("MMM Do YY")
                    : "Unknown Date"}
                </p>
                <div style={{display:"flex", alignItems:"center", gap:"20px"}}>
                  <div
                    className={style.icon}
                    onClick={() => handlePlayMusic(song)}
                  >
                    {currentSong?.id === song?.id && isPlaying ? (
                      <PauseIcon style={{ color: "#fff" }} />
                    ) : (
                      <PlayArrowIcon style={{ color: "#fff" }} />
                    )}
                  </div>
                  <button
                    className={style.btn}
                    onClick={() => handleChangePremiumToFree(song.id)}
                  >
                    Free
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className={style.sentence}>You don`t have premium tracks</p>
        )}
      </div>
    </section>
  );
};

export default PremiumTracks;
