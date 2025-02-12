import { Input } from "antd";
import style from "../../assets/style/forgotPass.module.scss";
import Grid from "@mui/material/Grid";
import { useFormik } from "formik";
import { forgotPassSchema } from "../../schema/forgotPassSchema";
import toast from "react-hot-toast";
import axios from "axios";
import { BASE_URL, ENDPOINT } from "../../api/endpoint";
import { MailOutlined } from "@ant-design/icons";
import { removeUserFromStorage, saveUserToStorage } from "../../utils/localeStorage";
import { useAllNonDeletedUsers } from "../../hooks/useUser";

const ForgotPass = () => {
  const { data } = useAllNonDeletedUsers();

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    onSubmit: async (values, actions) => {
      try {
        const cleanedValue = {
          email: values.email.trim(),
        };

        const user = data.find(
          (user) => user.email === cleanedValue.email
        );
        if (!user) {
          toast.error("Email not found");
          return;
        }

        const response = await axios.post(
          `${BASE_URL + ENDPOINT.users}/forgot-password`,
          cleanedValue
        );

        if (response) {
          toast.success(
            `We sent a reset link to ${cleanedValue.email}. Please check your email`
          );
          actions.resetForm();
          removeUserFromStorage();
          saveUserToStorage(response.data.token);
        }
      } catch (error) {
        console.log("Error: ", error);
        toast.error("Incorrect email. Please try again.");
      }
    },
    validationSchema: forgotPassSchema,
  });
  return (
    <>
      <section className={style.forgotPass}>
        <Grid container spacing={6}>
          <Grid item xs={12} sm={5} md={5} lg={5} xl={6}>
            <div className={style.text}>
              <p className={style.heading}>Forgot Password</p>
              <p className={style.sentence}>
                Please enter your email to reset the password:
              </p>
            </div>
            <form className={style.form} onSubmit={formik.handleSubmit}>
              <div className={style.field} style={{ position: "relative" }}>
                <label className={style.label} htmlFor="pass">
                  Email:{" "}
                </label>
                <Input
                  className={style.input}
                  name="email"
                  value={formik.values.email}
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
                  placeholder="Enter Your Email"
                  prefix={<MailOutlined />}
                />
                {formik.errors.email && formik.touched.email ? (
                  <p style={{ color: "#0E9EEF" }}>{formik.errors.email}</p>
                ) : null}
              </div>

              <button type="submit" className={style.resetBtn}>
                Reset Password
              </button>
            </form>
          </Grid>
          <Grid item xs={12} sm={7} md={7} lg={7} xl={6}>
            <div className={style.box}></div>
          </Grid>
        </Grid>
      </section>
    </>
  );
};

export default ForgotPass;
