import { useEffect, useState } from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import PlaylistAddCircleIcon from "@mui/icons-material/PlaylistAddCircle";
import style from "../../assets/style/artist/albumModal.module.scss";
import { FormControlLabel, Radio, RadioGroup, TextField } from "@mui/material";
import { useFormik } from "formik";
import { fetchArtistByToken } from "../../utils/reusableFunc";
import toast from "react-hot-toast";
import { getUserFromStorage } from "../../utils/localeStorage";
import axios from "axios";
import { BASE_URL, ENDPOINT } from "../../api/endpoint";
import { songSchema } from "../../schema/trackModal";
import Select from "react-select";
import { useGenres } from "../../hooks/useGenre";
import { useAllNonDeletedArtists } from "../../hooks/useArtist";

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

const TrackModal = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const { data: genres } = useGenres();
  const { data: artists } = useAllNonDeletedArtists();
  //   const [genreId, setGenreId] = useState("");
  // console.log(artists)
  // console.log(genres)

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

  //   console.log("artist.id:", artist.id);
  const formik = useFormik({
    initialValues: {
      name: "",
      duration: 0,
      coverImage: null,
      previewUrl: null,
      premiumOnly: false,
      collaboratedArtistIds: [],
      type: "single",
      artistId: "",
      genreId: "",
    },
    onSubmit: async (values, actions) => {
      console.log("values", values);

      try {
        const formData = new FormData();
        formData.append("name", values.name || "");
        formData.append("duration", values.duration || 0);
        formData.append("coverImage", values.coverImage || null);
        formData.append("previewUrl", values.previewUrl || null);
        formData.append("premiumOnly", values.premiumOnly);
        formData.append(
          "collaboratedArtistIds[]",
          values.collaboratedArtistIds || []
        );
        formData.append("type", values.type || "single");
        formData.append("artistId", artist.length > 0 ? artist[0]?.id : "");
        formData.append("genreId", values.genreId || "");

        for (let [key, value] of formData.entries()) {
          console.log(`${key}:`, value);
        }

        console.log("Posting data to server:", formData);

        const response = await axios.post(
          `${BASE_URL + ENDPOINT.tracks}`,
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
              <p className={style.heading}>Create Your Song</p>
              {/* name */}
              <div className={style.field} style={{ position: "relative" }}>
                <label
                  className={style.label}
                  htmlFor="name"
                  name="name"
                >
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
                    formik.setFieldValue("coverImage", e.currentTarget.files[0])
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
                    formik.setFieldValue("previewUrl", e.currentTarget.files[0])
                  }
                  onBlur={formik.handleBlur}
                />
                {formik.touched.previewUrl && formik.errors.previewUrl ? (
                  <p style={{ color: "#0E9EEF", marginBottom: "20px" }}>
                    {formik.errors.previewUrl}
                  </p>
                ) : null}
              </div>

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

                {formik.touched.duration && formik.errors.duration ? (
                  <p style={{ color: "#0E9EEF", marginBottom: "20px" }}>
                    {formik.errors.duration}
                  </p>
                ) : null}
              </div>

              <div style={{ display: "flex", gap: "20px" }}>
                {/* type */}
                <div className={style.field} style={{ position: "relative" }}>
                  <label className={style.label} htmlFor="type" name="type">
                    Type:
                  </label>
                  <RadioGroup
                    id="type"
                    aria-labelledby="demo-radio-buttons-group-label"
                    value={formik.values.type}
                    name="type"
                    onChange={formik.handleChange}
                  >
                    <FormControlLabel
                      value="single"
                      control={<Radio />}
                      label="Single"
                    />
                    <FormControlLabel
                      value="album"
                      control={<Radio />}
                      label="Album"
                    />
                  </RadioGroup>
                </div>
                {/* premium only */}
                <div
                  className={style.field}
                  style={{ position: "relative", display: "flex" }}
                >
                  <input
                    id="premiumOnly"
                    type="checkbox"
                    name="premiumOnly"
                    checked={formik.values.premiumOnly}
                    onChange={formik.handleChange}
                  />
                  <label
                    className={style.label}
                    htmlFor="premiumOnly"
                    name="premiumOnly"
                  >
                    Premium Only:
                  </label>
                </div>
              </div>

              <div style={{ display: "flex" }}>
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
                    value={formik.values.genreId || ''}
                    onChange={(e) =>
                      formik.setFieldValue("genreId", e.target.value)
                    } 
                    onBlur={formik.handleBlur} 
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
                    name="collaboratedArtistIds"
                    value={formik.values.collaboratedArtistIds || []}
                    onChange={(selected) => {
                      formik.setFieldValue(
                        "collaboratedArtistIds",
                        selected.map((s) => s.value)
                      );
                    }}
                    options={artists?.map((artist) => ({
                      label: artist.username,
                      value: artist.id,
                    }))}
                    isMulti
                    placeholder="Choose Collaborated Artists"
                  />
                </div>
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
export default TrackModal;
