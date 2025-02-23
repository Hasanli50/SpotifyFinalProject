import { useNavigate, useParams } from "react-router";
import style from "../../assets/style/user/playlistDetail.module.scss";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { BASE_URL, ENDPOINT } from "../../api/endpoint";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { getUserFromStorage } from "../../utils/localeStorage";
import { useAllTracks } from "../../hooks/useTrack";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAllNonDeletedUsers } from "../../hooks/useUser";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import EditPlaylist from "../../components/user/EditPlaylist";
import { fetchUserByToken } from "../../utils/reusableFunc";

const PlaylistDetail = () => {
  const { id } = useParams();
  const [playlist, setPlaylist] = useState([]);
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [collabs, setCollabs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const token = getUserFromStorage();
  const { data: tracks } = useAllTracks();
  const { data: users } = useAllNonDeletedUsers();
  const navigate = useNavigate();
  const [user, setUser] = useState([]);

  // Fetch user details
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

  // Function to fetch playlist details
  const fetchPlaylistDetails = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL + ENDPOINT.playlists}/${id}/playlist`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPlaylist(response.data.data);
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  // Fetch playlist on component mount and when id/token change
  useEffect(() => {
    fetchPlaylistDetails();
  }, [id, token]);

  // Update playlistTracks when tracks or playlist changes
  useEffect(() => {
    const track = tracks?.filter((s) =>
      playlist?.trackIds?.some((trackObj) => trackObj?.trackId === s?.id)
    );
    setPlaylistTracks(track);
  }, [tracks, playlist]);

  // Update collaborators
  useEffect(() => {
    const filteredCollabs = users?.filter((person) =>
      playlist?.collaborators?.includes(person?.id)
    );
    setCollabs(filteredCollabs);
  }, [users, playlist]);

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

  // Increment play count
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

  const handleRemoveTrack = async (playlistId, trackId) => {
    try {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const response = await axios.delete(
            `${
              BASE_URL + ENDPOINT.playlists
            }/${playlistId}/removeTrack/${trackId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success",
          });
          const updatedPlaylist = response.data.data;
          setPlaylist(updatedPlaylist);

          const updatedPlaylistTracks = tracks?.filter((s) =>
            updatedPlaylist?.trackIds?.some(
              (trackObj) => trackObj?.trackId === s?.id
            )
          );
          setPlaylistTracks(updatedPlaylistTracks);
        }
      });
    } catch (error) {
      toast.error("Error removing track");
      console.log("Error: ", error);
    }
  };

  const handleRemoveCollab = async (playlistId, collaboratorId) => {
    try {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, remove it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const response = await axios.delete(
            `${
              BASE_URL + ENDPOINT.playlists
            }/${playlistId}/removeCollaborator/${collaboratorId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          Swal.fire({
            title: "Removed!",
            text: "The collaborator has been removed.",
            icon: "success",
          });

          const updatedPlaylist = response.data.data;
          setPlaylist(updatedPlaylist);

          const updatedCollabs = users?.filter((user) =>
            updatedPlaylist?.collaborators?.includes(user.id)
          );
          setCollabs(updatedCollabs);
        }
      });
    } catch (error) {
      toast.error("Error removing collaborator");
      console.error("Error: ", error);
    }
  };

  const handleRemovePlaylist = async (playlistId) => {
    try {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await axios.delete(`${BASE_URL + ENDPOINT.playlists}/${playlistId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success",
          });

          navigate("/playlists");
        }
      });
    } catch (error) {
      toast.error("Error removing playlist");
      console.log("Error: ", error);
    }
  };

  return (
    <>
      <section className={style.playlistDetail}>
        <p className={style.heading}>
          <span style={{ color: "#EE10B0" }}>{playlist?.name}</span>
          {playlist?.userId === user?.id ? (
            <p style={{ display: "flex", gap: "10px" }}>
              <span>
                <EditPlaylist onPlaylistUpdated={fetchPlaylistDetails} />
              </span>
              <span onClick={() => handleRemovePlaylist(playlist?.id)}>
                <DeleteIcon />
              </span>
            </p>
          ) : (
            <></>
          )}
        </p>

        <div
          className={style.box}
          style={{
            display: playlist?.collaborators?.length > 0 ? "block" : "none",
          }}
        >
          <p className={style.heading}>Users :</p>
          <div style={{ display: "flex", gap: "10px" }}>
            {collabs?.length > 0 &&
              collabs?.map((user) => (
                <div key={user.id} className={style.user}>
                  <div className={style.profileImgBox}>
                    <img
                      className={style.profileImg}
                      src={user.image}
                      alt="profile image"
                    />
                    {playlist.userId !== user.id ? (
                      <div
                        onClick={() => handleRemoveCollab(playlist.id, user.id)}
                      >
                        <DeleteIcon className={style.trashIcon} />
                      </div>
                    ) : null}
                  </div>
                  <p className={style.name}>{user.username}</p>
                </div>
              ))}
          </div>
        </div>

        <div
        className={style.playlist}
          style={{
            display: "flex",
            gap: "40px",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          {playlistTracks?.length > 0 &&
            playlistTracks?.map((song) => (
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
                  <div style={{ display: "flex", gap: "5px" }}>
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
                    <div
                      onClick={() => handleRemoveTrack(playlist?.id, song?.id)}
                    >
                      <DeleteIcon />
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </section>
    </>
  );
};

export default PlaylistDetail;
