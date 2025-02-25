import { useEffect, useState } from "react";
import style from "../../assets/style/user/discover.module.scss";
import { useAllNonDeletedArtists } from "../../hooks/useArtist";
import { Link } from "react-router";
import AddIcon from "@mui/icons-material/Add";
import Grid from "@mui/material/Grid";
import { useGenres } from "../../hooks/useGenre";
import { getUserFromStorage } from "../../utils/localeStorage";
import { fetchUserByToken } from "../../utils/reusableFunc";

const Discover = () => {
  const { data } = useAllNonDeletedArtists();
  const { data: genres } = useGenres();
  const [artists, setArtists] = useState([]);

  //get user by token
  const [user, setUser] = useState([]);

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
    if (data?.length > 0) {
      const lastFiveTracks = data.slice(0, 5);
      setArtists(lastFiveTracks);
    }
  }, [data]);

  // Function to generate a random hex color code
  const generateRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  return (
    <>
      <section className={style.genres}>
        <p className={style.heading}>
          Browse <span style={{ color: "#EE10B0" }}>All</span> :{" "}
        </p>
        <Grid container spacing={2}>
          {genres?.length > 0 &&
            genres?.map((genre) => (
              <Grid item xs={12} sm={12} md={6} lg={4} xl={4} key={genre.id}>
                <Link to={user?.length === 0 ? "/login" : `/genre/${genre?.id}`}>
                  <div
                    className={style.box}
                    style={{
                      backgroundColor: generateRandomColor(),
                    }}
                  >
                    <p className={style.genreName}>{genre.name}</p>
                  </div>
                </Link>
              </Grid>
            ))}
        </Grid>
      </section>

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
          {artists.length > 0 &&
            artists.map((artist) => (
              <Link
                to={user?.length === 0 ? "/login" : `/artists/${artist?.id}`}
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
          <Link to={"/artists"}>
            <div className={style.viewAll}>
              <div className={style.circle}>
                <AddIcon
                  style={{
                    color: "#fff",
                    fontSize: "35px",
                    position: "absolute",
                    left: "22px",
                    bottom: "25px",
                  }}
                />
              </div>
              <p style={{ fontSize: "16px" }}>View All</p>
            </div>
          </Link>
        </div>
      </section>
    </>
  );
};

export default Discover;
