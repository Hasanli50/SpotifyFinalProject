import style from "../../assets/style/user/artistSongs.module.scss";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { BASE_URL, ENDPOINT } from "../../api/endpoint";
import { getUserFromStorage } from "../../utils/localeStorage";
import { useAllAlbums } from "../../hooks/useAlbum";
import SearchIcon from "@mui/icons-material/Search";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { Helmet } from "react-helmet-async";

const ArtistAlbum = () => {
  const { id } = useParams();
  const [artist, setArtist] = useState([]);
  const [artistAlbum, setArtistAlbums] = useState([]);
  const { data: albums } = useAllAlbums();
  const token = getUserFromStorage();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState(artistAlbum);

  //get user by id
  useEffect(() => {
    const handlegetArtistById = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL + ENDPOINT.artists}/artistDetail/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = response?.data?.data;
        setArtist(data);
      } catch (error) {
        console.log("Error: ", error);
      }
    };
    handlegetArtistById();
  }, [id, token]);

  //----------------------------------------------------
  // albums
  useEffect(() => {
    if (
      artist &&
      artist?.albumIds &&
      artist?.albumIds.length > 0 &&
      albums?.length > 0
    ) {
      const albumIds = albums?.filter((album) =>
        artist?.albumIds?.includes(album?.id)
      );
      setArtistAlbums(albumIds);
    }
  }, [artist, albums]);

  useEffect(() => {
    const data = artistAlbum?.filter((value) =>
      value?.name
        ?.trim()
        .toLowerCase()
        .includes(searchQuery.trim().toLowerCase())
    );
    setFilteredData(data);
  }, [artistAlbum, searchQuery]);

  return (
    <>
      <Helmet>
        <title>Albums</title>
      </Helmet>
      <section className={style.allSingleSongs}>
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

        <p className={style.heading}>
          <Link to={`/artists/${artist?.id}`}>
            <span className={style.back}>
              <KeyboardBackspaceIcon style={{ fontSize: "28px" }} />
            </span>
          </Link>
          <span
            style={{
              background:
                "linear-gradient( 90deg, rgba(238, 16, 176, 1) 12%,rgba(14, 158, 239, 1) 100%)",
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
          >
            {artist.username}
          </span>{" "}
          Albums :
        </p>

        <div className={style.albums}>
          {filteredData?.length > 0 ? (
            filteredData?.map((album) => (
              <Link to={`/album/${album?.id}`} key={album?.id}>
                <div className={style.card}>
                  <div className={style.imgBox}>
                    <img
                      className={style.img}
                      src={album.coverImage}
                      alt="coverImage"
                    />
                  </div>
                  <p className={style.letterTop}>{album.name}</p>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <p className={style.letterBottom}>
                      Songs: {album.trackCount}
                    </p>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p className={style.sentence}>You don`t have any albums</p>
          )}
        </div>
      </section>
    </>
  );
};

export default ArtistAlbum;
