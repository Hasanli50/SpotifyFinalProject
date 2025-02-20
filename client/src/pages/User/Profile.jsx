import { Box, Fade, Modal, TextField } from "@mui/material";
import style from "../../assets/style/user/profile.module.scss";
import { useEffect, useState } from "react";
import { fetchUserByToken } from "../../utils/reusableFunc";
import { getUserFromStorage } from "../../utils/localeStorage";
import axios from "axios";
import { BASE_URL, ENDPOINT } from "../../api/endpoint";
import toast from "react-hot-toast";
import { useFormik } from "formik";
import { updatePassSchema } from "../../schema/editPass";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";

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

const Profile = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const navigate = useNavigate();
  const [user, setUser] = useState({
    username: "",
    email: "",
    image: null,
  });

  //---------------------------------------------------------
  //get user by token
  const token = getUserFromStorage();
  useEffect(() => {
    const getUserByToken = async () => {
      try {
        const response = await fetchUserByToken(token);
        setUser(response);
      } catch (error) {
        console.log("Error:", error);
      }
    };
    getUserByToken();
  }, [token]);

  //---------------------------------------------------------
  //update user info
  const handleUpdateUserInfo = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("username", user?.username);
    formData.append("email", user?.email);
    if (user.image) {
      formData.append("image", user.image);
    }

    try {
      await axios.patch(
        `${BASE_URL + ENDPOINT.users}/update-info/${user?.id}`,
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

  //---------------------------------------------------------
  //update pass
  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    onSubmit: async (values, actions) => {
      try {
        const { password, confirmPassword } = values;
        console.log(values);

        if (password === user.password) {
          toast.error(
            "New password must be different from the current password"
          );
          return;
        }

        const response = await axios.patch(
          `${BASE_URL + ENDPOINT.users}/update-password/${user?.id}`,
          { password, confirmPassword },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response) {
          toast.success("Password successfully uptated!");
          actions.resetForm();
          handleClose();
        }
      } catch (error) {
        console.error("Error:", error.response?.data);
        toast.error("New password must be different from the current password");
      }
    },

    validationSchema: updatePassSchema,
  });

  //---------------------------------------------------------
  //freeze account
  const handleFreeze = () => {
    try {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, freeze it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const response = await axios.patch(
              `${BASE_URL + ENDPOINT.users}/freeze-account/${user?.id}`,
              { isFrozen: true },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (response) {
              toast.success("Your account has been successfully frozen!");
              Swal.fire({
                title: "Frozen!",
                text: "Your account has been frozen.",
                icon: "success",
              });
              navigate("/login");
            }
          } catch (error) {
            console.error("Error:", error.response?.data);
            toast.error("Failed to freeze account, please try again.");
          }
        } else {
          Swal.fire({
            title: "Cancelled",
            text: "Your account has not been frozen.",
            icon: "info",
          });
        }
      });
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to process the freeze action, please try again.");
    }
  };

  return (
    <>
      <section className={style.box}>
        <div className={style.card}>
          <form onSubmit={handleUpdateUserInfo}>
            <div className={style.field}>
              <label className={style.label} htmlFor="username">
                Username:
              </label>
              <TextField
                value={user.username || ""}
                onChange={(e) =>
                  setUser((prev) => ({ ...prev, username: e.target.value }))
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
                value={user.email || ""}
                onChange={(e) =>
                  setUser((prev) => ({ ...prev, email: e.target.value }))
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
                  setUser((prev) => ({
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
        <div>
          <p className={style.sentence}>
            To change your password, click{" "}
            <span
              onClick={handleOpen}
              style={{ color: "#EE10B0", cursor: "pointer" }}
            >
              here
            </span>
            .
          </p>

          <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={open}
            closeAfterTransition
          >
            <Fade in={open}>
              <Box sx={styles} component="form" onSubmit={formik.handleSubmit}>
                <p className={style.heading}>Edit Password</p>

                <div className={style.field}>
                  <label className={style.label} htmlFor="password">
                    PassWord:
                  </label>
                  <TextField
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    name="password"
                    type="password"
                    className={style.input}
                    id="password"
                    color="#FAB5E7"
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
                    label="Enter Password"
                    variant="outlined"
                  />
                  {formik.errors.password && formik.touched.password ? (
                    <p style={{ color: "#0E9EEF", marginBottom: "20px" }}>
                      {formik.errors.password}
                    </p>
                  ) : null}
                </div>

                <div className={style.field}>
                  <label className={style.label} htmlFor="confirmPassword">
                    Confirm password:
                  </label>
                  <TextField
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    name="confirmPassword"
                    className={style.input}
                    id="confirmPassword"
                    color="#FAB5E7"
                    type="password"
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
                    label="Enter Confirm Password"
                    variant="outlined"
                  />
                  {formik.errors.confirmPassword &&
                  formik.touched.confirmPassword ? (
                    <p style={{ color: "#0E9EEF", marginBottom: "20px" }}>
                      {formik.errors.confirmPassword}
                    </p>
                  ) : null}
                </div>

                <div className={style.buttons}>
                  <button type="submit" className={style.createBtn}>
                    Save Changes
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

        <p className={style.sentence}>
          If you need to freeze your account, please click{" "}
          <span
            onClick={handleFreeze}
            style={{ color: "#EE10B0", cursor: "pointer" }}
          >
            here
          </span>
          .
        </p>
      </section>
    </>
  );
};

export default Profile;
