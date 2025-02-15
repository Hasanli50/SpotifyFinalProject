import { useEffect, useState } from "react";
import style from "../../assets/style/artist/tracks.module.scss";
import SearchIcon from "@mui/icons-material/Search";
import { fetchArtistByToken } from "../../utils/reusableFunc";
import { getUserFromStorage } from "../../utils/localeStorage";
import { useAllTracks } from "../../hooks/useTrack";
import moment from "moment";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Menu, MenuItem } from "@mui/material";
import TrackModal from "../../components/artist/TrackModal";

const Tracks = () => {
  const [artist, setArtist] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [tracks, setTracks] = useState([]);
  const [filteredData, setFilteredData] = useState(tracks);
  const { data } = useAllTracks();

  const [anchorEl, setAnchorEl] = useState(null); // Updated to manage a single menu state
  const [currentSongId, setCurrentSongId] = useState(null); // Track which song's menu is open

  const handleMenuClick = (event, songId) => {
    setAnchorEl(event.currentTarget); // Set the current element as anchor
    setCurrentSongId(songId); // Set the song ID for the open menu
  };

  const handleMenuClose = () => {
    setAnchorEl(null); // Reset the anchor element
    setCurrentSongId(null); // Reset the current song ID
  };

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
      setTracks(trackIds);
    }
  }, [artist, data]);

  // Filter tracks by search query
  useEffect(() => {
    const data = tracks.filter((value) =>
      value.name.trim().toLowerCase().includes(searchQuery.trim().toLowerCase())
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
              <TrackModal />
            </div>
          </div>

          <div className={style.songs}>
            {filteredData?.length > 0 &&
              filteredData.map((songs, index) => (
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
                          {songs.albumId === null
                            ? "Single"
                            : songs.albumId.name}
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
                    <div onClick={(e) => handleMenuClick(e, songs.id)}>
                      <MoreVertIcon />
                    </div>

                    <Menu
                      anchorEl={anchorEl}
                      open={currentSongId === songs.id}
                      onClose={handleMenuClose}
                    >
                      <MenuItem onClick={handleMenuClose}>Delete Song</MenuItem>
                      <MenuItem onClick={handleMenuClose}>Edit Song</MenuItem>
                    </Menu>
                  </div>
                </div>
              ))}
          </div>
        </section>
      </main>
    </>
  );
};

export default Tracks;
