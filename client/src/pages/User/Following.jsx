import { useAllNonDeletedArtists } from "../../hooks/useArtist";
import style from "../../assets/style/user/following.module.scss";
// import { Link } from "react-router";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useState } from "react";
import { getUserFromStorage } from "../../utils/localeStorage";
import { fetchUserByToken } from "../../utils/reusableFunc";
import { Helmet } from "react-helmet-async";

function Following() {
  const { data } = useAllNonDeletedArtists();
  const [artists, setArtists] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  //get user by token
  const token = getUserFromStorage();
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

  useEffect(() => {
    if (data && user) {
      const followingArtist = data.filter((artist) =>
        user.following?.includes(artist.id)
      );
      setArtists(followingArtist);
    }
  }, [data, user]);

  useEffect(() => {
    const artist = artists?.filter((value) =>
      value?.username
        ?.trim()
        .toLowerCase()
        .includes(searchQuery.trim().toLowerCase())
    );
    setFilteredData(artist);
  }, [data, searchQuery, artists]);

  return (
    <>
      <Helmet>
        <title>Following</title>
      </Helmet>
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

      <section className={style.popular}>
        <p className={style.heading}>
          Following: {user?.following?.length || 0}
        </p>
        {filteredData?.length > 0 &&
          filteredData?.map((artist) => (
            <div className={style.box} key={artist.id}>
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
                      src={artist.coverImage}
                      alt="coverImage"
                    />
                  </div>
                  <div>
                    <p className={style.letterTop}>{artist.name}</p>
                    <p className={style.letterBottom}>
                      {artist.artistId.username}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </section>
    </>
  );
}

export default Following;
