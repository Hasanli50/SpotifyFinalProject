import { useEffect, useState } from "react";
import style from "../../assets/style/artist/albums.module.scss";
import { getUserFromStorage } from "../../utils/localeStorage";
import { fetchArtistByToken } from "../../utils/reusableFunc";
import { useAllAlbums } from "../../hooks/useAlbum";
import { Grid } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Swal from "sweetalert2";
import SearchIcon from "@mui/icons-material/Search";
import AlbumModal from "../../components/artist/AlbumModal";
import toast from "react-hot-toast";
import axios from "axios";
import { BASE_URL, ENDPOINT } from "../../api/endpoint";
import EditAlbum from "../../components/artist/editAlbum";
// import EditIcon from "@mui/icons-material/Edit";
// import { Link } from "react-router";

const Albums = () => {
  const [artist, setArtist] = useState([]);
  const [artistAlbum, setArtistAlbums] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState(artistAlbum);

  const token = getUserFromStorage();
  const { data } = useAllAlbums();
  // console.log(artist);

  //find artist
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

  // albums
  useEffect(() => {
    if (
      artist &&
      artist?.albumIds &&
      artist?.albumIds.length > 0 &&
      data?.length > 0
    ) {
      const albumIds = data.filter((album) =>
        artist.albumIds.includes(album.id)
      );
      setArtistAlbums(albumIds);
    }
  }, [artist, data]);

  const handleFilterData = (value) => {
    let keyword;
    switch (value) {
      case "default":
        keyword = [...artistAlbum];
        break;

      case "asc":
        keyword = [...artistAlbum].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        break;

      case "desc":
        keyword = [...artistAlbum].sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
        break;

      default:
        keyword = [...artistAlbum];
        break;
    }
    setFilteredData(keyword);
  };

  useEffect(() => {
    const data = artistAlbum.filter((value) =>
      value.name.trim().toLowerCase().includes(searchQuery.trim().toLowerCase())
    );
    setFilteredData(data);
  }, [artistAlbum, searchQuery]);

  const handleDelete = async (id) => {
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
            `${BASE_URL + ENDPOINT.albums}/${id}`
          );
          filteredData.filter((album) => album.id !== id);
          console.log(response);
          Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success",
          });
        }
      });
    } catch (error) {
      toast.error("Error in delete album. Please try again.");
      console.log("Error: ", error);
    }
  };

  return (
    <>
      <main className={style.main}>
        <section className={style.albums}>
          <div className={style.box}>
            <div className={style.inputBox}>
              <input
                onChange={(e) => setSearchQuery(e.target.value)}
                type="text"
                value={searchQuery}
                className={style.input}
                placeholder="Search for albums..."
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
              <AlbumModal />
            </div>
          </div>

          <div className={style.albums}>
            <Grid container spacing={2}>
              {filteredData?.length > 0 ? (
                filteredData.map((album) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} xl={3} key={album.id}>
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
                        <div style={{ display: "flex", gap:"10px" }}>
                          <div
                            style={{ color: "#fff" }}
                            onClick={() => handleDelete(album.id)}
                          >
                            <DeleteIcon />
                          </div>
                          <div>
                            <EditAlbum
                              style={{ color: "#fff" }}
                              id={album.id}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Grid>
                ))
              ) : (
                <p className={style.sentence}>You don`t have any albums</p>
              )}
            </Grid>
          </div>
        </section>
      </main>
    </>
  );
};

export default Albums;
