/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import style from "../../assets/style/artist/albumModal.module.scss";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import { TextField } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { getUserFromStorage } from "../../utils/localeStorage";
import toast from "react-hot-toast";
import { BASE_URL, ENDPOINT } from "../../api/endpoint";
import { useParams } from "react-router";
import axios from "axios";

const styles = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 450,
  bgcolor: "#1f1f1f",
  border: "2px solid #000",
  borderRadius: "15px",
  boxShadow: "-1px 2px 8px 10px rgba(128, 0, 128, 0.5)",
  p: 4,
};

const EditPlaylist = ({ onPlaylistUpdated }) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(""); 
  const token = getUserFromStorage();
  const { id } = useParams();

  useEffect(() => {
    const handleGetPlaylistById = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL + ENDPOINT.playlists}/${id}/playlist`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setName(response.data.data.name); 
      } catch (error) {
        console.log("Error fetching playlist: ", error);
      }
    };
    handleGetPlaylistById();
  }, [id, token]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.patch(
        `${BASE_URL + ENDPOINT.playlists}/${id}`,
        { name },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Playlist successfully updated!");
      if (onPlaylistUpdated) onPlaylistUpdated(response.data.data);
      handleClose();
    } catch (error) {
      toast.error("Failed to update playlist, try again!");
      console.error(error);
    }
  };

  return (
    <>
      <div onClick={handleOpen}>
        <EditIcon />
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{ backdrop: { timeout: 500 } }}
      >
        <Fade in={open}>
          <Box sx={styles} component="form" onSubmit={handleSubmit}>
            <p className={style.heading}>Update Playlist</p>
            <div className={style.field} style={{ position: "relative" }}>
              <label className={style.label} htmlFor="name">
                Playlist Name:
              </label>
              <TextField
                name="name"
                className={style.input}
                id="outlined-basic"
                value={name} 
                onChange={(e) => setName(e.target.value)} 
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
                      },
                      "& .MuiInputLabel-root": {
                        color: "#FAB5E7",
                      },
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "#FAB5E7",
                  },
                }}
                label="Enter Playlist Name"
                variant="outlined"
              />
            </div>

            <div className={style.buttons}>
              <button type="submit" className={style.createBtn}>
                Update
              </button>
              <button
                type="button"
                className={style.cancelBtn}
                onClick={handleClose}
              >
                Cancel
              </button>
            </div>
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default EditPlaylist;
