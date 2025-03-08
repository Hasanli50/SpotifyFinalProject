import { useEffect, useRef, useState } from "react";
import style from "../../assets/style/artist/tracks.module.scss";
import SearchIcon from "@mui/icons-material/Search";
import { fetchArtistByToken } from "../../utils/reusableFunc";
import { getUserFromStorage } from "../../utils/localeStorage";
import { useAllTracks } from "../../hooks/useTrack";
import moment from "moment";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Menu, MenuItem } from "@mui/material";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import axios from "axios";
import { BASE_URL, ENDPOINT } from "../../api/endpoint";
import Swal from "sweetalert2";
import TrackModal from "../../components/artist/TrackModal";

const Tracks = () => {
  const [artist, setArtist] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [tracks, setTracks] = useState([]);
  const [filteredData, setFilteredData] = useState(tracks);
  const { data } = useAllTracks();
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const [anchorEl, setAnchorEl] = useState(null);
  const [currentSongId, setCurrentSongId] = useState(null);
  const token = getUserFromStorage();
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
      audioRef.current = new Audio(song?.previewUrl);
      audioRef.current.play();
      setIsPlaying(true);

      handlePlayCount(song?.id);
    }
  };

  //----------------------------------------------------
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

  const handleMenuClick = (event, songId) => {
    setAnchorEl(event.currentTarget);
    setCurrentSongId(songId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setCurrentSongId(null);
  };

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
      artist?.trackIds?.length > 0 &&
      data?.length > 0
    ) {
      const trackIds = data?.filter((track) =>
        artist?.trackIds?.includes(track?.id)
      );
      setTracks(trackIds);
    }
  }, [artist, data]);

  // Filter tracks by search query
  useEffect(() => {
    const data = tracks?.filter((value) =>
      value?.name
        ?.trim()
        .toLowerCase()
        .includes(searchQuery.trim().toLowerCase())
    );
    setFilteredData(data);
  }, [tracks, searchQuery]);

  // Handle track sorting
  const handleFilterData = (value) => {
    let keyword;
    switch (value) {
      case "default":
        keyword = [...tracks];
        break;
      case "asc":
        keyword = [...tracks].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        break;
      case "desc":
        keyword = [...tracks].sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
        break;
      default:
        keyword = [...tracks];
        break;
    }
    setFilteredData(keyword);
  };

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
          const songs = tracks?.filter((song) => song?.id !== songId);
          setFilteredData(songs);
          await axios.delete(`${BASE_URL + ENDPOINT.tracks}/${songId}`);
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
      <main className={style.main}>
        <section className={style.tracks}>
          <div className={style.box}>
            <div className={style.inputBox}>
              <input
                onChange={(e) => setSearchQuery(e.target.value)}
                type="text"
                value={searchQuery}
                className={style.input}
                placeholder="Search for songs..."
              />
              <SearchIcon className={style.searchIcon} />
            </div>

            <select
              className={style.select}
              onChange={(e) => handleFilterData(e.target.value)}
            >
              <option value="default">default</option>
              <option value="asc">asc</option>
              <option value="desc">desc</option>
            </select>
            <div className={style.btn}>
              <TrackModal setFilteredData={setFilteredData} />
            </div>
          </div>

          <div className={style.songs}>
            {filteredData?.length > 0 ? (
              filteredData
                ?.filter((song) => song?.type === "single")
                .map((songs) => (
                  <div className={style.card} key={songs.id}>
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
                      <div className={style.icons}>
                        <div onClick={(e) => handleMenuClick(e, songs.id)}>
                          <MoreVertIcon />
                        </div>

                        <Menu
                          anchorEl={anchorEl}
                          open={currentSongId === songs.id}
                          onClose={handleMenuClose}
                        >
                          <MenuItem
                            onClick={() => {
                              handleDelete(songs.id), handleMenuClose();
                            }}
                          >
                            Delete Song
                          </MenuItem>
                          {/* <MenuItem onClick={handleMenuClose}>Edit Song</MenuItem> */}
                        </Menu>
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
                ))
            ) : (
              <p className={style.sentence}>Artist dont have single songs</p>
            )}
          </div>
        </section>
      </main>
    </>
  );
};

export default Tracks;
