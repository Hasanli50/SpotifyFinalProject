import { useEffect, useState } from "react";
import style from "../../assets/style/artist/albumModal.module.scss";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import { TextField } from "@mui/material";
import { getUserFromStorage } from "../../utils/localeStorage";
import toast from "react-hot-toast";
import { useFormik } from "formik";
import { BASE_URL, ENDPOINT } from "../../api/endpoint";
import axios from "axios";
import Select from "react-select";
import { useAllNonDeletedUsers } from "../../hooks/useUser";
import { createPlaylistWithCollabSchema } from "../../schema/playlistWithCollab";
import { fetchUserByToken } from "../../utils/reusableFunc";

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

const NewPlaylistwithCollab = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const token = getUserFromStorage();
  const { data } = useAllNonDeletedUsers();
  const [currentUser, setCurentUser] = useState([]);

  useEffect(() => {
    const getUserByToken = async () => {
      try {
        const response = await fetchUserByToken(token);
        setCurentUser(response);
      } catch (error) {
        console.log("Error:", error);
      }
    };
    getUserByToken();
  }, [token]);

  const formik = useFormik({
    initialValues: {
      name: "",
      collaborators: [],
    },
    onSubmit: async (values, actions) => {
      console.log("Submitting form data:", {
        name: values.name,
        collaborators: values.collaborators,
      });

      try {
        const response = await axios.post(
          `${BASE_URL + ENDPOINT.playlists}/create`,
          {
            name: values.name,
            collaborators: values.collaborators,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 201) {
          toast.success("Playlist successfully created!");
          actions.resetForm();
          handleClose();
        }
      } catch (error) {
        console.error("Error:", error);
        if (error.response) {
          toast.error(
            error.response.data.message ||
              "Failed to create playlist, try again!"
          );
        } else {
          toast.error("Failed to create playlist, try again!");
        }
      }
    },
    validationSchema: createPlaylistWithCollabSchema,
  });
  return (
    <>
      <div onClick={handleOpen}>+ New Playlist With Collaborator</div>
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
              <p className={style.heading}>Create Playlist With Collaborator</p>
              <div className={style.field} style={{ position: "relative" }}>
                <label className={style.label} htmlFor="name">
                  Playlist Name:
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
                {formik.errors.name && formik.touched.name ? (
                  <p style={{ color: "#0E9EEF", marginBottom: "20px" }}>
                    {formik.errors.name}
                  </p>
                ) : null}
              </div>

              <div className={style.field} style={{ position: "relative" }}>
                <label
                  className={style.label}
                  htmlFor="collaborators"
                  name="collaborators"
                >
                  Coloborate User:
                </label>
                <Select
                  className={style.select}
                  name="collaborators"
                  value={
                    data
                      ?.filter((user) =>
                        formik.values.collaborators.includes(user.id)
                      )
                      .map((user) => ({
                        label: user.username,
                        value: user.id,
                      })) || []
                  }
                  onChange={(selected) => {
                    formik.setFieldValue(
                      "collaborators",
                      selected.map((s) => s.value)
                    );
                  }}
                  options={
                    data
                    ?.filter(
                      (user) =>
                        user.role === "user" && 
                        user.id !== currentUser.id && 
                        !formik.values.collaborators.includes(user.id) 
                    )
                      .map((user) => ({
                        label: user.username,
                        value: user.id,
                      })) || []
                  }
                  isMulti
                  placeholder="Choose Collaborated Users"
                />
                {formik.errors.collaborators && formik.touched.collaborators ? (
                  <p style={{ color: "#0E9EEF", marginBottom: "20px" }}>
                    {formik.errors.collaborators}
                  </p>
                ) : null}
              </div>

              <div className={style.buttons}>
                <button type="submit" className={style.createBtn}>
                  Create
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
      </div>
    </>
  );
};

export default NewPlaylistwithCollab;
