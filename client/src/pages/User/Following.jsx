import { useAllNonDeletedArtists } from "../../hooks/useArtist";
import style from "../../assets/style/user/following.module.scss";
// import { Link } from "react-router";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useState } from "react";
import { getUserFromStorage } from "../../utils/localeStorage";
import { fetchUserByToken } from "../../utils/reusableFunc";
import { Helmet } from "react-helmet-async";
import axios from "axios";
import { BASE_URL, ENDPOINT } from "../../api/endpoint";
import toast from "react-hot-toast";

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
      const followingArtist = data?.filter((artist) =>
        user?.following?.includes(artist?.id)
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

  const deleteFollowing = async (artistId) => {
    try {
      await axios.patch(
        `${BASE_URL + ENDPOINT.users}/delete-follow/${artistId}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Artist deleted from following list!");
    } catch (error) {
      console.log("Error:", error.response?.data?.message || error.message);
    }
  };

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
                      src={artist.image}
                      alt="image"
                    />
                  </div>
                  <div>
                    <p className={style.letterTop}>{artist?.username}</p>
                    <p className={style.letterBottom}>
                      Songs: {artist?.trackIds?.length}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteFollowing(artist?.id)}
                    className={style.followBtn}
                  >
                    Following
                  </button>
                </div>
              </div>
            </div>
          ))}
      </section>
    </>
  );
}

export default Following;
