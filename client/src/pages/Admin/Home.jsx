import { useEffect, useState } from "react";
import style from "../../assets/style/admin/home.module.scss";
import { useAllNonDeletedArtists } from "../../hooks/useArtist";
import { useFetchALlPlaylists } from "../../hooks/usePlaylist";
import { useAllTracks } from "../../hooks/useTrack";
import { useAllNonDeletedUsers } from "../../hooks/useUser";
import { getUserFromStorage } from "../../utils/localeStorage";
import { fetcAdminByToken } from "../../utils/reusableFunc";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Box, Typography } from "@mui/material";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Home = () => {
  const { data: traacks } = useAllTracks();
  const { data: artists } = useAllNonDeletedArtists();
  const { data: users } = useAllNonDeletedUsers();
  const { data: playlists } = useFetchALlPlaylists();
  const [chartData, setChartData] = useState({});
  // console.log(artists)

  const [admin, setAdmin] = useState([]);

  const token = getUserFromStorage();
  useEffect(() => {
    const getUserByToken = async () => {
      try {
        const response = await fetcAdminByToken(token);
        setAdmin(response);
      } catch (error) {
        console.log("Error:", error);
      }
    };
    getUserByToken();
  }, [token]);

  useEffect(() => {
    if (artists?.length) {
      const artistNames = artists.map((artist) => artist.username);
      const followersCount = artists.map((artist) => artist?.followers || 0);

      setChartData({
        labels: artistNames,
        datasets: [
          {
            label: "Followers Count",
            data: followersCount, // Followers data
            backgroundColor: "#42a5f5", // Bar color
            borderColor: "#1e88e5",
            borderWidth: 1,
          },
        ],
      });
    }
  }, [artists]);

  return (
    <>
      <section className={style.home}>
        <p className={style.heading}>
          Welcome back,{" "}
          <span style={{ color: "#7886C7" }}>{admin?.username}</span>!
        </p>
        <p className={style.paragraph}>
          As an administrator, you have full control over the platform’s
          operations. Stay up-to-date with the latest stats, manage artists and
          users, and ensure everything is running smoothly.
        </p>

        <div className={style.box}>
          <ul className={style.list}>
            <li className={style.item}>
              Total Active Users:
              <span className={style.count}> {users?.length}</span>
            </li>
            <li className={style.item}>
              Total Artists:
              <span className={style.count}> {artists?.length}</span>
            </li>
            <li className={style.item}>
              Songs Count:
              <span className={style.count}> {traacks?.length}</span>
            </li>
            <li className={style.item}>
              Total Playlists:
              <span className={style.count}>{playlists?.length}</span>
            </li>
          </ul>

          <Box sx={{ maxWidth: "500px", margin: "0 auto" }}>
            <Typography variant="h6" gutterBottom>
              Artist Followers
            </Typography>
            {chartData.labels ? (
              <Bar
                data={chartData}
                options={{
                  responsive: true,
                  plugins: {
                    title: {
                      display: true,
                      text: "Followers Count by Artist",
                    },
                    legend: {
                      position: "top",
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                    },
                  },
                }}
              />
            ) : (
              <Typography variant="body1">Loading chart...</Typography>
            )}
          </Box>
        </div>
      </section>
    </>
  );
};

export default Home;
