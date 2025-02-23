import { Link } from "react-router";
import style from "../../assets/style/user/playlists.module.scss";
import { useFetchALlPlaylistsByUser } from "../../hooks/usePlaylist";
import Grid from "@mui/material/Grid";
import { fetchUserByToken } from "../../utils/reusableFunc";
import { useEffect, useState } from "react";
import { getUserFromStorage } from "../../utils/localeStorage";

const Playlists = () => {
  const { data: playlists } = useFetchALlPlaylistsByUser();
  const [collabPlaylists, setCollabPlaylists] = useState([]);
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
    if (user && playlists) {
      const userCollaboratedPlaylists = playlists.filter((playlist) =>
        playlist.collaborators.includes(user.id)
      );
      setCollabPlaylists(userCollaboratedPlaylists);
    }
  }, [user, playlists]);

  return (
    <>
      <section className={style.playlists}>
        <p className={style.heading}>
          Your <span style={{ color: "#EE10B0" }}>Playlists</span> :{" "}
        </p>

        <Grid container spacing={5}>
          {playlists?.length > 0 ? (
            playlists?.map((playlist) =>
              playlist.userId === user?.id ? (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={6}
                  lg={4}
                  xl={4}
                  key={playlist.id}
                >
                  <Link to={`/playlist/${playlist.id}`}>
                    <div className={style.box}>
                      <p style={{ color: "#fff" }}>{playlist.name}</p>
                    </div>
                  </Link>
                </Grid>
              ) : null
            )
          ) : (
            <p className={style.sentence}>You don`t have any playlist</p>
          )}
        </Grid>
      </section>

      {user.isPremium === false ? (
        ""
      ) : (
        <section className={style.playlists}>
          <p className={style.heading}>
            Collaborate <span style={{ color: "#EE10B0" }}>Playlists</span> :{" "}
          </p>

          <Grid container spacing={5}>
            {collabPlaylists?.length > 0 ? (
              collabPlaylists?.map((playlist) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={6}
                  lg={4}
                  xl={4}
                  key={playlist.id}
                >
                  <Link to={`/playlist/${playlist.id}`}>
                    <div className={style.box}>
                      <p style={{ color: "#fff" }}>{playlist.name}</p>
                    </div>
                  </Link>
                </Grid>
              ))
            ) : (
              <p className={style.sentence}>
                You don’t have any collaborative playlist
              </p>
            )}
          </Grid>
        </section>
      )}
    </>
  );
};

export default Playlists;
