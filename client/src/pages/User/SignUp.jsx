import { LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import style from "../../assets/style/register.module.scss";
import { Link } from "react-router";
import { Input } from "antd";
import { useFormik } from "formik";
import { Register } from "../../classes/Register";
import { signUpSchema } from "../../schema/signUpSchema";
import toast from "react-hot-toast";
import { UserCloudinary } from "../../utils/userCloudinary";
import axios from "axios";
import { BASE_URL, ENDPOINT } from "../../api/endpoint";
import { useAllNonDeletedUsers } from "../../hooks/useUser";
import { Helmet } from "react-helmet-async";

const SignUp = () => {
  const { data } = useAllNonDeletedUsers();

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      image: null,
    },
    onSubmit: async (values, actions) => {
      try {
        if (values.image) {
          const uploadResponse = await UserCloudinary(values.image);
          const newUser = new Register(
            values.username,
            values.email,
            values.password,
            uploadResponse.secure_url
          );
          const duplicateEmail = data?.find((x) => x?.email === newUser?.email);
          const duplicateUsername = data?.find(
            (x) => x?.username === newUser?.username
          );

          if (duplicateUsername) {
            toast.error("Username already taken!");
            formik.setFieldValue("username", "");
            return;
          }
          if (duplicateEmail) {
            toast.error("Email already taken!");
            formik.setFieldValue("email", "");
            return;
          }

          if (!duplicateUsername && !duplicateEmail) {
            await axios.post(`${BASE_URL + ENDPOINT.users}/register`, values, {
              headers: { "Content-Type": "multipart/form-data" },
            });
            toast.success(
              "You successfully registered, check your email and verify account!"
            );
            actions.resetForm();
            return;
          }
        }
      } catch (error) {
        console.error("Error: ", error);
        toast.error("Failed to register, try again!");
      }
    },
    validationSchema: signUpSchema,
  });

  return (
    <>
      <Helmet>
        <title>Sign Up</title>
      </Helmet>
      <div className={style.card}>
        <div className={style.top}>
          <Link to={"/register"} className={`${style.letter} ${style.signUp}`}>
            <p>Sign Up</p>
          </Link>

          <Link to={"/login"} className={style.letter}>
            <p>Sign In</p>
          </Link>
        </div>
        <form className={style.form} onSubmit={formik.handleSubmit}>
          <div className={style.field} style={{ position: "relative" }}>
            <label className={style.label} htmlFor="username">
              Username:
            </label>
            <Input
              className={style.input}
              name="username"
              value={formik.values.username}
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
              placeholder="Enter Your Username"
              prefix={<UserOutlined />}
            />
            {formik.errors.username && formik.touched.username ? (
              <p style={{ color: "#0E9EEF" }}>{formik.errors.username}</p>
            ) : null}
          </div>
          <div className={style.field} style={{ position: "relative" }}>
            <label className={style.label} htmlFor="pass">
              Password:{" "}
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

          <div className={style.field} style={{ position: "relative" }}>
            <label className={style.label} htmlFor="pass">
              Profile image:{" "}
            </label>
            <input
              className={style.input}
              name="image"
              type="file"
              onChange={(e) =>
                formik.setFieldValue("image", e.currentTarget.files[0])
              }
              onBlur={formik.handleBlur}
              style={{
                background: "none",
                borderRadius: "4px",
                width: "100%",
                color: "#fff",
              }}
            />
            {formik.errors.image && formik.touched.image ? (
              <p style={{ color: "#0E9EEF" }}>{formik.errors.image}</p>
            ) : null}
          </div>

          <button type="submit" className={style.loginBtn}>
            Sign Up
          </button>
        </form>
      </div>
    </>
  );
};

export default SignUp;
