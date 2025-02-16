import moment from "moment";
import { useEffect, useState } from "react";
import { useAllTracks } from "../../hooks/useTrack";
import { getUserFromStorage } from "../../utils/localeStorage";
import { fetchArtistByToken } from "../../utils/reusableFunc";
import style from "../../assets/style/artist/premiumTracks.module.scss";
import axios from "axios";
import { BASE_URL, ENDPOINT } from "../../api/endpoint";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const PremiumTracks = () => {
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
    if (
      artist &&
      artist?.trackIds &&
      artist?.trackIds.length > 0 &&
      data?.length > 0
    ) {
      const trackIds = data?.filter((track) =>
        artist.trackIds.includes(track.id)
      );
      const filteredData = trackIds?.filter(
        (track) => track.premiumOnly === true
      );
      console.log(filteredData);
      if (filteredData) {
        setTracks(filteredData);
      }
    }
  }, [artist, data]);

  const handleChangePremiumToFree = async (id) => {
    try {
      const track = tracks.find((track) => track.id === id);
  
      if (!track) {
        return;
      }
  
      const updatedTrack = { ...track, premiumOnly: false };
  
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
          const response = await axios.patch(
            `${BASE_URL + ENDPOINT.tracks}/${id}/premium-only`,
            { premiumOnly: false }
          );
  
          if (response.status === 200) {
            setTracks((prevTracks) =>
              prevTracks.map((track) =>
                track.id === id ? updatedTrack : track
              )
            );
  
            Swal.fire({
              title: "Updated!",
              text: "The track is now free.",
              icon: "success",
            });
          }
        }
      });
    } catch (error) {
      console.log("Error: ", error);
      toast.error("Failed to change premium to free. Please try again.");
    }
  };
  


  return (
    <>
      <section className={style.premiumTracks}>
        <p className={style.heading}>Premium Tracks: </p>
        <div className={style.songs}>
          {tracks?.length > 0 ? (
            tracks.map((songs, index) => (
              <div className={style.songBox} key={songs.id}>
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
                    </div>
                    <div>
                      <p className={style.letterTop}>{songs.name}</p>
                      <p className={style.letterBottom}>
                        {songs.albumId === null ? "Single" : songs.albumId.name}
                      </p>
                    </div>
                  </div>

                  {/* Audio style */}
                  <div className={style.audioPlayerContainer}>
                    <audio controls className={style.blackAudioPlayer}>
                      <source src={songs.previewUrl} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                  <p className={style.songsCard__letter}>
                    {moment(songs.createdAt).format("MMM Do YY")}
                  </p>
                  <button className={style.btn} onClick={() => handleChangePremiumToFree(songs.id)}>free</button>
                </div>
              </div>
            ))
          ) : (
            <p className={style.sentence}>You don`t have premium tracks</p>
          )}
        </div>
      </section>
    </>
  );
};

export default PremiumTracks;
