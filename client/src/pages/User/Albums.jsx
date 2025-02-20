import style from "../../assets/style/user/artistSongs.module.scss";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useAllAlbums } from "../../hooks/useAlbum";
import SearchIcon from "@mui/icons-material/Search";

const Albums = () => {
  const { data: albums } = useAllAlbums();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState(albums);

  useEffect(() => {
    const data = albums?.filter(
      (value) =>
        value.name
          .trim()
          .toLowerCase()
          .includes(searchQuery.trim().toLowerCase()) ||
        value?.artistId?.username
          .trim()
          .toLowerCase()
          .includes(searchQuery.trim().toLowerCase())
    );
    setFilteredData(data);
  }, [albums, searchQuery]);

  return (
    <>
      <section className={style.allSingleSongs}>
        <div className={style.inputBox}>
          <input
            onChange={(e) => setSearchQuery(e.target.value)}
            type="text"
            value={searchQuery}
            className={style.input}
            placeholder="Search for artist, albums..."
          />
          <SearchIcon className={style.searchIcon} />
        </div>

        <p className={style.heading}>Albums :</p>

        <div className={style.albums}>
          {filteredData?.length > 0 ? (
            filteredData.map((album) => (
              <Link to={`/album/${album.id}`} key={album.id}>
                <div className={style.card}>
                  <div className={style.imgBox}>
                    <img
                      className={style.img}
                      src={album.coverImage}
                      alt="coverImage"
                    />
                  </div>
                  <p className={style.letterTop}>{album.name}</p>
                  <p className={style.letterTop}>{album?.artistId?.username}</p>

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

export default Albums;
