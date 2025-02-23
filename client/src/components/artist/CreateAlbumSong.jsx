/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import style from "../../assets/style/artist/albumModal.module.scss";
import { Checkbox, FormControlLabel, TextField } from "@mui/material";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import { getUserFromStorage } from "../../utils/localeStorage";
import axios from "axios";
import { BASE_URL, ENDPOINT } from "../../api/endpoint";
import { songSchema } from "../../schema/trackModal";
import Select from "react-select";
import { useGenres } from "../../hooks/useGenre";
import { useAllNonDeletedArtists } from "../../hooks/useArtist";
import { fetchArtistByToken } from "../../utils/reusableFunc";
import Grid from "@mui/material/Grid";

const styles = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "#1f1f1f",
  border: "2px solid #000",
  borderRadius: "15px",
  boxShadow: "-1px 2px 8px 10px rgba(128, 0, 128, 0.5)",
  p: 4,
  maxHeight: "80vh", 
  overflowY: "auto", 
  width: "70%", 
  '@media (max-width: 600px)': {
    width: '100%',  
    maxHeight: '90vh', 
  },
};


const CreateAlbumSong = ({ albumId }) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const { data: genres } = useGenres();
  const { data: artists } = useAllNonDeletedArtists();

  const token = getUserFromStorage();
  const [user, setUser] = useState([]);

  useEffect(() => {
    const getUserByToken = async () => {
      try {
        const response = await fetchArtistByToken(token);
        setUser(response);
      } catch (error) {
        console.log("Error:", error);
      }
    };
    getUserByToken();
  }, [token]);

  const formik = useFormik({
    initialValues: {
      name: "",
      duration: 0,
      albumId: "",
      coverImage: null,
      previewUrl: null,
      premiumOnly: false,
      collaboratedArtistIds: [],
      type: "album",
      artistId: "",
      genreId: "",
    },
    onSubmit: async (values, actions) => {
      console.log("values", values);

      try {
        const formData = new FormData();
        formData.append("name", values.name || "");
        formData.append("duration", values.duration || 0);
        formData.append("albumId", albumId);
        formData.append("coverImage", values.coverImage || null);
        formData.append("previewUrl", values.previewUrl || null);
        formData.append("premiumOnly", values.premiumOnly);
        (values.collaboratedArtistIds || []).forEach((id) => {
          formData.append("collaboratedArtistIds[]", id);
        });

        formData.append("type", values.type || "album");
        formData.append("artistId", user?.id || "");
        formData.append("genreId", values.genreId || "");

        for (let [key, value] of formData.entries()) {
          console.log(`${key}:`, value);
        }

        const response = await axios.post(
          `${BASE_URL + ENDPOINT.tracks}/albumSong`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log("Server response:", response);

        if (response) {
          toast.success("Track successfully created!");
          actions.resetForm();
          handleClose();
        }
      } catch (error) {
        console.error(
          "Error while posting data:",
          error.response || error.message || error
        );
        console.error("Error:", error);
        toast.error("Failed to create track, try again!");
      }
    },
    validationSchema: songSchema,
  });

  return (
    <>
      <div onClick={handleOpen} style={{ margin: "30px 0" }}>
        <AddCircleOutlineIcon
          style={{ color: "#fff", fontSize: "45px", cursor: "pointer" }}
        />
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
              <p className={style.heading}>Create Your Song</p>

              <Grid container spacing={10}>
                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                  {/* name */}
                  <div className={style.field} style={{ position: "relative" }}>
                    <label className={style.label} htmlFor="name" name="name">
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
                              borderColor: "#FAB5E7",
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
                          color: "#FAB5E7",
                        },
                        "& input::placeholder": {
                          color: "#fff",
                        },
                      }}
                      label="Enter Album Name"
                      variant="outlined"
                    />

                    {formik.touched.name && formik.errors.name ? (
                      <p style={{ color: "#0E9EEF", marginBottom: "20px" }}>
                        {formik.errors.name}
                      </p>
                    ) : null}
                  </div>
                  {/* image */}
                  <div className={style.field} style={{ position: "relative" }}>
                    <label
                      className={style.label}
                      htmlFor="coverImage"
                      name="coverImage"
                    >
                      Cover Image:{" "}
                    </label>
                    <input
                      // className={style.input}
                      id="coverImage"
                      name="coverImage"
                      type="file"
                      style={{ marginBottom: "10px", color: "#FAB5E7" }}
                      onChange={(e) =>
                        formik.setFieldValue(
                          "coverImage",
                          e.currentTarget.files[0]
                        )
                      }
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.coverImage && formik.errors.coverImage ? (
                      <p style={{ color: "#0E9EEF", marginBottom: "20px" }}>
                        {formik.errors.coverImage}
                      </p>
                    ) : null}
                  </div>
                  {/* preview url */}
                  <div className={style.field} style={{ position: "relative" }}>
                    <label
                      className={style.label}
                      htmlFor="previewUrl"
                      name="previewUrl"
                    >
                      Preview url:{" "}
                    </label>
                    <input
                      // className={style.input}
                      id="previewUrl"
                      name="previewUrl"
                      type="file"
                      style={{ marginBottom: "10px", color: "#FAB5E7" }}
                      onChange={(e) =>
                        formik.setFieldValue(
                          "previewUrl",
                          e.currentTarget.files[0]
                        )
                      }
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.previewUrl && formik.errors.previewUrl ? (
                      <p style={{ color: "#0E9EEF", marginBottom: "20px" }}>
                        {formik.errors.previewUrl}
                      </p>
                    ) : null}
                  </div>
                  <FormControlLabel
                    control={
                      <Checkbox
                        id="premiumOnly"
                        name="premiumOnly"
                        checked={formik.values.premiumOnly}
                        onChange={formik.handleChange}
                        sx={{
                          "& .MuiSvgIcon-root": {
                            borderColor: "rgba(238, 16, 176, 1)",
                            "&:hover": {
                              borderColor: "rgba(238, 16, 176, 1)",
                            },
                            "&.Mui-checked": {
                              color: "rgba(238, 16, 176, 1)",
                            },
                          },
                        }}
                      />
                    }
                    label="Premium"
                    labelPlacement="end"
                    sx={{
                      color: "#FAB5E7",
                      "&.MuiFormControlLabel-root:hover": {
                        color: "#FAB5E7",
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                  {/* duration */}
                  <div className={style.field} style={{ position: "relative" }}>
                    <label
                      className={style.label}
                      htmlFor="duration"
                      name="duration"
                    >
                      Duration:
                    </label>
                    <TextField
                      name="duration"
                      type="number"
                      value={formik.values.duration}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={style.input}
                      id="duration"
                      min="0"
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
                              borderColor: "#FAB5E7",
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
                          color: "#FAB5E7",
                        },
                        "& input::placeholder": {
                          color: "#fff",
                        },
                      }}
                      label="Enter Album Name"
                      variant="outlined"
                    />

                    {formik.touched.duration && formik.errors.duration ? (
                      <p style={{ color: "#0E9EEF", marginBottom: "20px" }}>
                        {formik.errors.duration}
                      </p>
                    ) : null}
                  </div>
                  {/* colobarated artists */}
                  <div className={style.field} style={{ position: "relative" }}>
                    <label
                      className={style.label}
                      htmlFor="genre"
                      name="collaboratedArtistIds"
                    >
                      Coloborate Artist:
                    </label>
                    <Select
                      isMulti
                      name="collaboratedArtistIds"
                      value={artists
                        ?.filter((artist) =>
                          formik.values.collaboratedArtistIds.includes(
                            artist.id
                          )
                        )
                        .map((artist) => ({
                          label: artist?.username,
                          value: artist?.id,
                        }))}
                      onChange={(selected) => {
                        formik.setFieldValue(
                          "collaboratedArtistIds",
                          selected.map((s) => s?.value)
                        );
                      }}
                      options={artists
                        ?.filter(
                          (artist) =>
                            !formik.values.collaboratedArtistIds.includes(
                              artist?.id
                            )
                        )
                        .map((artist) => ({
                          label: artist.username,
                          value: artist.id,
                        }))}
                      placeholder="Select Collaborated Artists"
                    />
                  </div>

                  {/* genres */}
                  <div className={style.field} style={{ position: "relative" }}>
                    <label
                      className={style.label}
                      htmlFor="genreId"
                      name="genreId"
                    >
                      Choose Genre:
                    </label>
                    <select
                      id="genreId"
                      name="genreId"
                      value={formik.values.genreId || ""}
                      onChange={(e) =>
                        formik.setFieldValue("genreId", e.target.value)
                      }
                      onBlur={formik.handleBlur}
                      style={{
                        marginBottom: "10px",
                        width: "100%",
                        padding: "10px 10px 10px 5px",
                        borderRadius: "5px",
                        color: "#838383",
                        fontSize: "16px",
                      }}
                    >
                      <option value="">Select Genre</option>
                      {genres?.map((genre) => (
                        <option key={genre.id} value={genre.id}>
                          {genre.name}
                        </option>
                      ))}
                    </select>
                    {formik.touched.genreId && formik.errors.genreId ? (
                      <p style={{ color: "#0E9EEF", marginBottom: "20px" }}>
                        {formik.errors.genreId}
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
                </Grid>
              </Grid>
            </Box>
          </Fade>
        </Modal>
      </div>
    </>
  );
};
export default CreateAlbumSong;
