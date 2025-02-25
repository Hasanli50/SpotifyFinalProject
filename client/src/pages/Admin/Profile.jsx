import { TextField } from "@mui/material";
import style from "../../assets/style/admin/profile.module.scss";
import { useEffect, useState } from "react";
import { fetcAdminByToken } from "../../utils/reusableFunc";
import { getUserFromStorage } from "../../utils/localeStorage";
import axios from "axios";
import { BASE_URL, ENDPOINT } from "../../api/endpoint";
import toast from "react-hot-toast";

const Profile = () => {
  const [admin, setAdmin] = useState({
    username: "",
    email: "",
    image: null,
  });

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("username", admin?.username);
    formData.append("email", admin?.email);
    if (admin.image) {
      formData.append("image", admin.image);
    }

    try {
      await axios.patch(
        `${BASE_URL + ENDPOINT.users}/update-info/${admin?.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Profile successfully updated!");
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
            value={admin?.username || ""}
            onChange={(e) =>
              setAdmin((prev) => ({ ...prev, username: e.target.value }))
            }
            sx={{
              marginBottom: "10px",
              width: "100%",
              color: "#fff",
              "& .MuiOutlinedInput-root": {
                color:"#fff",
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#fff",
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#fff",
                  borderWidth: "2px",
                },
                "&.Mui-focused": {
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#A9B5DF",
                    borderWidth: "2px",
                  },
                  "& input": {
                    borderColor: "#fff",
                    background: "transparant",
                  },
                  "& .MuiInputLabel-root": {
                    color: "#fff",
                  },
                },
              },
              "& .MuiInputLabel-root": {
                color: "#A9B5DF",
              },
              "& input::placeholder": {
                color: "#fff",
              },
            }}
            name="username"
            className={style.input}
            label="Username"
            variant="outlined"
          />
        </div>

        <div className={style.field}>
          <label className={style.label} htmlFor="email">
            Email:
          </label>
          <TextField
            value={admin?.email || ""}
            onChange={(e) =>
              setAdmin((prev) => ({ ...prev, email: e.target.value }))
            }
            sx={{
              marginBottom: "10px",
              width: "100%",
              color: "#fff",
              "& .MuiOutlinedInput-root": {
                color:"#fff",
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#fff",
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#fff",
                  borderWidth: "2px",
                },
                "&.Mui-focused": {
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#A9B5DF",
                    borderWidth: "2px",
                  },
                  "& input": {
                    borderColor: "#fff",
                    background: "transparant",
                  },
                  "& .MuiInputLabel-root": {
                    color: "#fff",
                  },
                },
              },
              "& .MuiInputLabel-root": {
                color: "#A9B5DF",
              },
              "& input::placeholder": {
                color: "#fff",
              },
            }}
            name="email"
            className={style.input}
            label="Email"
            variant="outlined"
          />
        </div>

        <div className={style.field}>
          <label className={style.label} htmlFor="image">
            Profile Image:
          </label>
          <input
            onChange={(e) =>
              setAdmin((prev) => ({
                ...prev,
                image: e.target.files[0],
              }))
            }
            name="image"
            type="file"
            style={{ marginBottom: "10px" }}
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
