import { LockOutlined } from "@ant-design/icons";
import { useFormik } from "formik";
import style from "../../assets/style/resetPass.module.scss";
import { BASE_URL, ENDPOINT } from "../../api/endpoint";
import toast from "react-hot-toast";
import { resetPassSchema } from "../../schema/resetPassSchema";
import { Grid } from "@mui/material";
import axios from "axios";
import { useNavigate, useParams } from "react-router";
import { Input } from "antd";
import {
  removeUserFromStorage,
  saveUserToStorage,
} from "../../utils/localeStorage";
import { Helmet } from "react-helmet-async";

const ResetPass = () => {
  const navigate = useNavigate();
  const { token } = useParams();

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    onSubmit: async (values, actions) => {
      try {
        const cleanedValue = {
          password: values.password.trim(),
          confirmPassword: values.confirmPassword.trim(),
        };

        if (cleanedValue.password !== cleanedValue.confirmPassword) {
          toast.error("Passwords do not match");
          return;
        }

        const response = await axios.post(
          `${BASE_URL + ENDPOINT.artists}/reset-password/${token}`,
          cleanedValue,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        removeUserFromStorage();

        // Save the new token in local storage
        saveUserToStorage(response.data.token);
        if (response) {
          toast.success("Congratulations! Your password has been changed");
          actions.resetForm();
          setTimeout(() => {
            navigate("/artist/login");
          }, 300);
        }
      } catch (error) {
        console.log("Error: ", error);
        toast.error("Error in reset password");
      }
    },
    validationSchema: resetPassSchema,
  });
  return (
    <>
      <Helmet>
        <title>Reset Password</title>
      </Helmet>
      <section className={style.resetPass}>
        <Grid container spacing={6}>
          <Grid item xs={12} sm={12} md={5} lg={5} xl={6}>
            <div className={style.text}>
              <p className={style.heading}>Set a new password</p>
              <p className={style.sentence}>Create a new password:</p>
            </div>

            <form className={style.form} onSubmit={formik.handleSubmit}>
              <div className={style.field} style={{ position: "relative" }}>
                <label className={style.label} htmlFor="pass">
                  Password:
                </label>
                <Input
                  className={style.input}
                  name="password"
                  type="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  style={{
                    background: "none",
                    borderRadius: "4px",
                    border: "2px solid #fff",
                    width: "100%",
                    color: "#fff",
                  }}
                  size="large"
                  placeholder="Enter Your Password"
                  prefix={<LockOutlined />}
                />
                {formik.errors.password && formik.touched.password ? (
                  <p style={{ color: "#0E9EEF" }}>{formik.errors.password}</p>
                ) : null}
              </div>

              <div className={style.field} style={{ position: "relative" }}>
                <label className={style.label} htmlFor="pass">
                  Confirm Password:
                </label>
                <Input
                  className={style.input}
                  name="confirmPassword"
                  type="password"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  style={{
                    background: "none",
                    borderRadius: "4px",
                    border: "2px solid #fff",
                    width: "100%",
                    color: "#fff",
                  }}
                  size="large"
                  placeholder="Re-Enter Password"
                  prefix={<LockOutlined />}
                />
                {formik.errors.confirmPassword &&
                formik.touched.confirmPassword ? (
                  <p style={{ color: "#0E9EEF" }}>
                    {formik.errors.confirmPassword}
                  </p>
                ) : null}
              </div>

              <button type="submit" className={style.updatePassBtn}>
                Update Password
              </button>
            </form>
          </Grid>

          <Grid item xs={12} sm={12} md={7} lg={7} xl={6}>
            <div className={style.box}></div>
          </Grid>
        </Grid>
      </section>
    </>
  );
};

export default ResetPass;
