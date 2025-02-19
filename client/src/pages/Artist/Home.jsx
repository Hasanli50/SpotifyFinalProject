import style from "../../assets/style/artist/home.module.scss";
import Grid from "@mui/material/Grid";
import { getUserFromStorage } from "../../utils/localeStorage";
import { useEffect, useState } from "react";
import { fetchArtistByToken, formatDuration } from "../../utils/reusableFunc";
import { useAllAlbums } from "../../hooks/useAlbum";
import { useAllTracks } from "../../hooks/useTrack";
import moment from "moment";

const Home = () => {
  const [artist, setArtist] = useState([]);
  const [artistAlbum, setArtistAlbums] = useState([]);
  const [artistSongs, setArtistSongs] = useState([]);
  const [newSongs, setNewSongs] = useState([]);
  const [trendingSongs, setTrendingSongs] = useState([]);

  const { data } = useAllAlbums();
  const { data: tracks } = useAllTracks();
  const token = getUserFromStorage();
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
      // console.log("Filtered Albums:", albumIds);
      if (albumIds.length > 0) {
        const sortedAlbums = [...albumIds].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        const lastFiveAlbums = sortedAlbums.slice(0, 5);

        // console.log("Last 5 Albums:", lastFiveAlbums);
        setArtistAlbums(lastFiveAlbums);
      }
    }
  }, [artist, data]);

  //top songs
  useEffect(() => {
    if (
      artist &&
      artist?.trackIds &&
      artist?.trackIds.length > 0 &&
      tracks?.length > 0
    ) {
      const trackIds = tracks?.filter((track) =>
        artist.trackIds.includes(track.id)
      );
      const single =
        trackIds?.length > 0 &&
        trackIds?.filter((track) => track.type === "single");
      // console.log("singles: ", single);
      // console.log("Filtered Tracks:", trackIds);
      if (single?.length > 0) {
        const sortedTracks = [...single].sort(
          (a, b) => b.playCount - a.playCount
        );

        const lastFiveTracks = sortedTracks.slice(0, 5);

        // console.log("Last 5 Albums:", lastFiveTracks);
        setArtistSongs(lastFiveTracks);
      }
    }
  }, [artist, tracks]);

  //new relwase songs
  useEffect(() => {
    if (tracks?.length > 0) {
      const sortedTracks = [...tracks].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      const lastFiveTracks = sortedTracks.slice(0, 5);
      setNewSongs(lastFiveTracks);
    }
  }, [tracks]);

  //trending songs
  useEffect(() => {
    if (tracks?.length > 0) {
      const sortedTracks = [...tracks].sort(
        (a, b) => b.playCount - a.playCount
      );

      const lastFiveTracks = sortedTracks.slice(0, 5);
      setTrendingSongs(lastFiveTracks);
      console.log(tracks);
    }
  }, [tracks]);

  return (
    <>
      <main className={style.main}>
        <section className={style.albums}>
          <p className={style.heading}>
            Your Last <span style={{ color: "#EE10B0" }}>Albums</span> :{" "}
          </p>
          <Grid container spacing={2}>
            {artistAlbum?.length > 0 ? (
              artistAlbum?.map((album) => (
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
                    <p className={style.letterBottom}>
                      Songs: {album.trackCount}
                    </p>
                  </div>
                </Grid>
              ))
            ) : (
              <p className={style.sentence}>You don`t have any albums</p>
            )}
          </Grid>
        </section>

        <section className={style.singles}>
          <p className={style.heading}>
            Top <span style={{ color: "#EE10B0" }}>Singles</span> :{" "}
          </p>
          <Grid container spacing={2}>
            {artistSongs?.length > 0 ? (
              artistSongs?.map((songs) => (
                <Grid item xs={12} sm={6} md={4} lg={3} xl={3} key={songs.id}>
                  <div className={style.card}>
                    <div className={style.imgBox}>
                      <img
                        className={style.img}
                        src={songs.coverImage}
                        alt="image"
                      />
                    </div>
                    <p className={style.letterTop}>{songs.name}</p>
                    <p className={style.letterBottom}>{songs.playCount}</p>
                  </div>
                </Grid>
              ))
            ) : (
              <p className={style.sentence}>You don`t have any singles</p>
            )}
          </Grid>
        </section>

        <section className={style.songs}>
          <p className={style.heading}>
            New Release <span style={{ color: "#EE10B0" }}>Songs</span> :{" "}
          </p>
          <Grid container spacing={2}>
            {newSongs?.length > 0 &&
              newSongs.map((songs) => (
                <Grid item xs={12} sm={6} md={4} lg={3} xl={3} key={songs.id}>
                  <div className={style.card}>
                    <div className={style.imgBox}>
                      <img
                        className={style.img}
                        src={songs.coverImage}
                        alt="coverImage"
                      />
                    </div>
                    <p className={style.letterTop}>{songs.name}</p>
                    <p className={style.letterBottom}>
                      {moment(songs.createdAt).format("MMM Do YY")}
                    </p>
                  </div>
                </Grid>
              ))}
          </Grid>
        </section>

        <section className={style.trendingSngs}>
          <p className={style.heading}>
            Trending <span style={{ color: "#EE10B0" }}>Songs</span> :{" "}
          </p>
          {trendingSongs?.length > 0 &&
            trendingSongs.map((songs, index) => (
              <div className={style.box} key={songs.id}>
                <p className={style.place}>#{index + 1}</p>
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
                        {songs.artistId.username}
                      </p>
                    </div>
                  </div>

                  <p className={style.songsCard__letter}>
                    {moment(songs.createdAt).format("MMM Do YY")}
                  </p>
                  <p className={style.songsCard__letter}>
                    {songs.albumId === null ? "Single" : songs.albumId.name}
                  </p>
                  <p>{formatDuration(songs.duration)}</p>
                </div>
              </div>
            ))}
        </section>
      </main>
    </>
  );
};

export default Home;
