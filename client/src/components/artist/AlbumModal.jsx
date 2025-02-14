import { useEffect, useState } from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
// import Typography from '@mui/material/Typography';
import PlaylistAddCircleIcon from "@mui/icons-material/PlaylistAddCircle";
import style from "../../assets/style/artist/albumModal.module.scss";
import { TextField } from "@mui/material";
import { useFormik } from "formik";
import { fetchArtistByToken } from "../../utils/reusableFunc";
import toast from "react-hot-toast";
import { albumSchema } from "../../schema/albumModalSchema";
import { getUserFromStorage } from "../../utils/localeStorage";
import axios from "axios";
import { BASE_URL, ENDPOINT } from "../../api/endpoint";

const styles = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 450,
  bgcolor: "#1f1f1f",
  border: "2px solid #000",
  //   boxShadow: 30,
  borderRadius: "15px",
  boxShadow: "-1px 2px 8px 10px rgba(128, 0, 128, 0.5)",
  p: 4,
};

const AlbumModal = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [artist, setArtist] = useState([]);

  const token = getUserFromStorage();

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

  const formik = useFormik({
    initialValues: {
      name: "",
      coverImage: null,
      artistId: "",
    },
    onSubmit: async (values, actions) => {
      try {
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("artistId", artist.id);
        formData.append("coverImage", values.coverImage);

        console.log("Sending data to server:", formData);

        const response = await axios.post(
          `${BASE_URL + ENDPOINT.albums}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.status === 201) {
          toast.success("Album successfully created!");
          actions.resetForm();
          handleClose();
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error("Failed to create album, try again!");
      }
    },

    validationSchema: albumSchema,
  });

  return (
    <>
      <div onClick={handleOpen}>
        <PlaylistAddCircleIcon style={{ fontSize: "30px" }} />
      </div>
      <div style={{ padding: "0 20px" }}>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={open}
          onClose={handleClose}
          closeAfterTransition
          slots={{ backdrop: Backdrop }}
          slotProps={{
            backdrop: {
              timeout: 500,
            },
          }}
        >
          <Fade in={open}>
            <Box sx={styles} component="form" onSubmit={formik.handleSubmit}>
              <p className={style.heading}>Create Your Album</p>
              <div className={style.field} style={{ position: "relative" }}>
                <label className={style.label} htmlFor="username">
                  Name:
                </label>
                <TextField
                  name="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={style.input}
                  id="outlined-basic"
                  sx={{
                    marginBottom: "10px",
                    width: "100%",
                    "& .MuiOutlinedInput-root": {
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

                {formik.errors.name && formik.touched.name ? (
                  <p style={{ color: "#0E9EEF", marginBottom: "20px" }}>
                    {formik.errors.name}
                  </p>
                ) : null}
              </div>

              <div className={style.field} style={{ position: "relative" }}>
                <label className={style.label} htmlFor="image">
                  Cover Image:{" "}
                </label>
                <input
                  // className={style.input}
                  name="coverImage"
                  type="file"
                  style={{ marginBottom: "10px", color: "#FAB5E7" }}
                  onChange={(e) =>
                    formik.setFieldValue("coverImage", e.currentTarget.files[0])
                  }
                  onBlur={formik.handleBlur}
                />
                {formik.errors.coverImage && formik.touched.coverImage ? (
                  <p style={{ color: "#0E9EEF", marginBottom: "20px" }}>
                    {formik.errors.coverImage}
                  </p>
                ) : null}
              </div>
              <div className={style.buttons}>
                <button type="submit" className={style.createBtn}>
                  create
                </button>
                <button
                  type="button"
                  className={style.cancelBtn}
                  onClick={handleClose}
                >
                  cancel
                </button>
              </div>
            </Box>
          </Fade>
        </Modal>
      </div>
    </>
  );
};
export default AlbumModal;
