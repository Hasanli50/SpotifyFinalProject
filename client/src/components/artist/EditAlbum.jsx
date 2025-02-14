/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import style from "../../assets/style/artist/albumModal.module.scss";
import { TextField } from "@mui/material";
import toast from "react-hot-toast";
import axios from "axios";
import { BASE_URL, ENDPOINT } from "../../api/endpoint";
import { Link } from "react-router";
import EditIcon from "@mui/icons-material/Edit";

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

const EditAlbum = ({ id }) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [editAlbum, setEditAlbum] = useState({ name: "", coverImage: null });

  useEffect(() => {
    const fetchAlbumById = async () => {
      try {
        if (id) {
          const response = await axios.get(
            `${BASE_URL}${ENDPOINT.albums}/${id}`
          );
          const album = response.data?.data;

          if (album) {
            setEditAlbum({
              name: album?.name || "",
              coverImage: album?.coverImage || null,
            });
          }
        }
      } catch (error) {
        console.error("Error fetching album:", error);
      }
    };

    fetchAlbumById();
  }, [id]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", editAlbum.name);
    if (editAlbum.coverImage) {
      formData.append("coverImage", editAlbum.coverImage);
    }
    try {
      await axios.patch(`${BASE_URL + ENDPOINT.albums}/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Album successfully updated!");
      handleClose();
    } catch (error) {
      toast.error("Failed to update album, try again!");
      console.error(error);
    }
  };

  return (
    <>
      <div onClick={handleOpen}>
        <EditIcon style={{ color: "#fff" }} />
      </div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        closeAfterTransition
      >
        <Fade in={open}>
          <Box sx={styles} component="form" onSubmit={handleSubmit}>
            <p className={style.heading}>Edit: {editAlbum.name}</p>

            <div className={style.field}>
              <label className={style.label} htmlFor="name">
                Name:
              </label>
              <TextField
                value={editAlbum.name}
                onChange={(e) =>
                  setEditAlbum({ ...editAlbum, name: e.target.value })
                }
                name="name"
                className={style.input}
                id="outlined-basic"
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
                label="Enter Album Name"
                variant="outlined"
              />
            </div>

            <div className={style.field}>
              <label className={style.label} htmlFor="coverImage">
                Cover Image:
              </label>
              <input
                onChange={(e) =>
                  setEditAlbum({
                    ...editAlbum,
                    coverImage: e.target.files[0] || "",
                  })
                }
                name="coverImage"
                type="file"
                style={{ marginBottom: "10px", color: "#FAB5E7" }}
              />
            </div>

            <div className={style.buttons}>
              <button type="submit" className={style.createBtn}>
                Save Changes
              </button>
              <Link to="/artist/albums">
                <button
                  type="button"
                  className={style.cancelBtn}
                  onClick={handleClose}
                >
                  Cancel
                </button>
              </Link>
            </div>
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default EditAlbum;
