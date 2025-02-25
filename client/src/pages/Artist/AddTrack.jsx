import { Link, useParams } from "react-router";
import style from "../../assets/style/user/albumDetail.module.scss";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { BASE_URL, ENDPOINT } from "../../api/endpoint";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import CreateAlbumSong from "../../components/artist/CreateAlbumSong";
import moment from "moment";
import { useAllTracks } from "../../hooks/useTrack";
import Swal from "sweetalert2";

const AddTrack = () => {
  const { id } = useParams();
  const [album, setAlbum] = useState([]);
  const [songs, setSongs] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const { data: tracks } = useAllTracks();

  console.log(id);
  // album
  useEffect(() => {
    const getById = async () => {
      try {
        const response = await axios.get(`${BASE_URL + ENDPOINT.albums}/${id}`);
        const data = response.data.data;
        setAlbum(data);
      } catch (error) {
        console.log("Error: ", error);
      }
    };
    getById();
  }, [id]);

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

  useEffect(() => {
    const song = tracks?.filter((track) => track?.albumId?._id === id);
    setSongs(song);
    setFilteredData(song);
  }, [tracks, id]);

  const handleDelete = async (songId) => {
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
          await axios.delete(`${BASE_URL + ENDPOINT.tracks}/${songId}`);
          const musics = songs?.filter((song) => song?.id !== songId);
          setFilteredData(musics);
          Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success",
          });
        }
      });
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  return (
    <>
      <section className={style.album}>
        <Link to={"/artist/albums"}>
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
            <span style={{ color: "#fff" }}> {album?.artistId?.username}</span>
          </p>
          <p className={style.songsCount}>
            Songs:{" "}
            <span style={{ color: "#fff" }}>{album?.trackIds?.length}</span>{" "}
          </p>
          <CreateAlbumSong albumId={id} />
        </div>
      </section>

      <section className={style.songs}>
        <p className={style.heading}>Songs: </p>
        <div className={style.albumSongs}>
          {filteredData?.length > 0 ? (
            filteredData?.map((song, index) => (
              <div className={style.box} key={song.id}>
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
                        src={song.coverImage}
                        alt="coverImage"
                      />
                      <WorkspacePremiumIcon
                        className={style.premiumMini}
                        style={{
                          fontSize: "18px",
                          display:
                            song.premiumOnly === false ? "none" : "block",
                        }}
                      />
                    </div>
                    <div>
                      <p className={style.letterTop}>{song.name}</p>
                      <p className={style.letterBottom}>
                        {song.albumId?.name || "Single"}
                      </p>
                    </div>
                  </div>
                  <p className={style.songsCard__letter}>
                    {song.createdAt
                      ? moment(song.createdAt).format("MMM Do YY")
                      : "Unknown Date"}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "20px",
                    }}
                  >
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
                      onClick={() => handleDelete(song.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className={style.sentence}>Songs Not found</p>
          )}
        </div>
      </section>
    </>
  );
};

export default AddTrack;
