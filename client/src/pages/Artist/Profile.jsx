import { TextField } from "@mui/material";
import style from "../../assets/style/artist/profile.module.scss";
import Select from "react-select";
import { useEffect, useState } from "react";
import { fetchArtistByToken } from "../../utils/reusableFunc";
import { getUserFromStorage } from "../../utils/localeStorage";
import axios from "axios";
import { BASE_URL, ENDPOINT } from "../../api/endpoint";
import toast from "react-hot-toast";
import { useGenres } from "../../hooks/useGenre";
import Textarea from "@mui/joy/Textarea";

const Profile = () => {
  const [artist, setArtist] = useState({
    username: "",
    email: "",
    description: "",
    genreIds: [],
    image: null,
  });

  const { data } = useGenres();
  const token = getUserFromStorage();

  console.log("artist genres: ", artist.genreIds);

  // Fetch artist details
  useEffect(() => {
    const getArtistByToken = async () => {
      try {
        const response = await fetchArtistByToken(token);
        setArtist(response);
      } catch (error) {
        console.error("Error fetching artist:", error);
      }
    };
    getArtistByToken();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("username", artist.username);
    formData.append("email", artist.email);
    formData.append("description", artist.description);
    artist.genreIds?.forEach((id) => formData.append("genreIds[]", id));
    if (artist.image) {
      formData.append("image", artist.image);
    }

    try {
      await axios.patch(
        `${BASE_URL + ENDPOINT.artists}/update-info/${artist.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Artist successfully updated!");
    } catch (error) {
      toast.error("Failed to update artist, try again!");
      console.error("Error updating artist:", error.response?.data || error);
    }
  };

  return (
    <div className={style.card}>
      <form onSubmit={handleSubmit}>
        <div className={style.field}>
          <label className={style.label} htmlFor="username">
            Username:
          </label>
          <TextField
            value={artist.username || ""}
            onChange={(e) =>
              setArtist((prev) => ({ ...prev, username: e.target.value }))
            }
            sx={{
              marginBottom: "10px",
              width: "100%",
              "& .MuiOutlinedInput-root": {
                color: "#FAB5E7",
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(238, 16, 176, 1)",
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(238, 16, 176, 1)",
                  borderWidth: "2px",
                },
                "&.Mui-focused": {
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#FAB5E7",
                    borderWidth: "2px",
                  },
                  "& input": {
                    color: "#FAB5E7",
                    background: "transparant",
                  },
                  "& .MuiInputLabel-root": {
                    color: "#FAB5E7",
                  },
                },
              },
              "& .MuiInputLabel-root": {
                color: "#FAB5E7",
              },
              "& input::placeholder": {
                color: "#FAB5E7",
              },
            }}
            name="username"
            className={style.input}
            label="Enter Username"
            variant="outlined"
          />
        </div>

        <div className={style.field}>
          <label className={style.label} htmlFor="email">
            Email:
          </label>
          <TextField
            value={artist.email || ""}
            onChange={(e) =>
              setArtist((prev) => ({ ...prev, email: e.target.value }))
            }
            sx={{
              marginBottom: "10px",
              width: "100%",
              "& .MuiOutlinedInput-root": {
                color: "#FAB5E7",
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(238, 16, 176, 1)",
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(238, 16, 176, 1)",
                  borderWidth: "2px",
                },
                "&.Mui-focused": {
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#FAB5E7",
                    borderWidth: "2px",
                  },
                  "& input": {
                    color: "#FAB5E7",
                    background: "transparant",
                  },
                  "& .MuiInputLabel-root": {
                    color: "#FAB5E7",
                  },
                },
              },
              "& .MuiInputLabel-root": {
                color: "#FAB5E7",
              },
              "& input::placeholder": {
                color: "#FAB5E7",
              },
            }}
            name="email"
            className={style.input}
            label="Enter Email"
            variant="outlined"
          />
        </div>

        <div className={style.field}>
          <label className={style.label} htmlFor="image">
            Profile Image:
          </label>
          <input
            onChange={(e) =>
              setArtist((prev) => ({
                ...prev,
                image: e.target.files[0],
              }))
            }
            name="image"
            type="file"
            style={{ marginBottom: "10px" }}
          />
        </div>
        <div className={style.field}>
          <label className={style.label} htmlFor="description">
            Description:
          </label>
          <Textarea
            sx={{
              overflow: "auto",
              height: "200px",
            }}
            value={artist.description || ""}
            onChange={(e) =>
              setArtist((prev) => ({ ...prev, description: e.target.value }))
            }
            size="lg"
            name="Size"
            placeholder="Large"
          />
        </div>
        {/* select genres have bug */}
        <div className={style.field}>
          <label className={style.label}>Genres:</label>
          <Select
            isMulti
            value={artist?.genreIds?.map((genre) => {
              const genreFromData = data?.find((g) => g?.id == genre?._id);
              if (genreFromData) {
                return {
                  value: genreFromData?.id,
                  label: genreFromData?.name,
                };
              }
              return null;
            })}
            options={
              data
                ? data.map((genre) => ({
                    value: genre.id,
                    label: genre.name,
                  }))
                : []
            }
            onChange={(selectedOptions) =>
              setArtist((prev) => ({
                ...prev,
                genreIds: selectedOptions.map((option) => option.value), // Use id as the value
              }))
            }
          />
        </div>

        <div className={style.buttons}>
          <button type="submit" className={style.saveBtn}>
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
