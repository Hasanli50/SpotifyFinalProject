import { useAllNonDeletedArtists } from "../../hooks/useArtist";
import style from "../../assets/style/user/artists.module.scss";
import { Link } from "react-router";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useState } from "react";
import { getUserFromStorage } from "../../utils/localeStorage";
import { fetchUserByToken } from "../../utils/reusableFunc";

const Artists = () => {
  const { data } = useAllNonDeletedArtists();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  //get user by token
  const [user, setUser] = useState([]);

  const token = getUserFromStorage();
  const role = localStorage.getItem("userauth");
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
  console.log("user token", user?.length);

  useEffect(() => {
    const artists = data?.filter((value) =>
      value?.username
        ?.trim()
        .toLowerCase()
        .includes(searchQuery.trim().toLowerCase())
    );
    setFilteredData(artists);
  }, [data, searchQuery]);

  return (
    <>
      <div className={style.inputBox}>
        <input
          onChange={(e) => setSearchQuery(e.target.value)}
          type="text"
          value={searchQuery}
          className={style.input}
          placeholder="Search for artists..."
        />
        <SearchIcon className={style.searchIcon} />
      </div>
      <section className={style.allArtists}>
        <p className={style.heading}>
          All <span style={{ color: "#EE10B0" }}>Artists</span> :{" "}
        </p>

        <div
          style={{
            display: "flex",
            gap: "40px",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          {filteredData?.length > 0 &&
            filteredData?.map((artist) => (
              <Link
                to={ role && Object.keys(user).length === 0 ? "/login" : `/artists/${artist?.id}`}
                key={artist?.id}
              >
                <div className={style.artists}>
                  <div className={style.profileImgBox}>
                    <img
                      className={style.profileImg}
                      src={artist.image}
                      alt="profile image"
                    />
                  </div>
                  <p style={{ fontSize: "16px", color: "#fff" }}>
                    {artist.username}
                  </p>
                </div>
              </Link>
            ))}
        </div>
      </section>
    </>
  );
};

export default Artists;
