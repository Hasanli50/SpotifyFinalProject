import { LockOutlined, UserOutlined } from "@ant-design/icons";
import style from "../../assets/style/admin/login.module.scss";
import { Input } from "antd";
import { useNavigate } from "react-router";
import { useFormik } from "formik";
import { loginSchema } from "../../schema/loginSchema";
import toast from "react-hot-toast";
import { BASE_URL, ENDPOINT } from "../../api/endpoint";
import axios from "axios";
import { saveUserToStorage } from "../../utils/localeStorage";
import { useAllNonDeletedUsers } from "../../hooks/useUser";

const Login = () => {
  const { data } = useAllNonDeletedUsers();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    onSubmit: async (values, actions) => {
      try {
        const cleanedValues = {
          username: values.username.trim(),
          password: values.password.trim(),
        };

        const user = data.find(
          (user) =>
            user?.username === cleanedValues?.username && user?.role === "admin"
        );
        if (!user) {
          toast.error("Incorrect username. Please try again.");
          return;
        }

        if (user?.isVerified !== true) {
          toast.error("Please check your email and verify your account");
          return;
        }

        const response = await axios.post(
          `${BASE_URL + ENDPOINT.users}/login`,
          cleanedValues
        );
        if (response && response.data.token) {
          actions.resetForm();
          toast.success("Successfully signed in!");
          saveUserToStorage(response.data.token);
          localStorage.setItem("adminauth", "true");
          const role = localStorage.getItem("adminauth");
          if (role) {
            navigate("/admin");
          }

          // setTimeout(() => {
          //   navigate("/admin");
          // }, 300);
        } else {
          toast.error("Login failed. Please try again.");
        }
      } catch (error) {
        console.log("Error: ", error);
        toast.error(
          "Incorrect password. Please try again or click to `Forgot Password`."
        );
      }
    },
    validationSchema: loginSchema,
  });

  return (
    <>
      <div className={style.card}>
        <p className={`${style.letter} ${style.login}`}>Login</p>

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
              <p style={{ color: "#fff" }}>{formik.errors.username}</p>
            ) : null}
          </div>

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
              <p style={{ color: "#fff" }}>{formik.errors.password}</p>
            ) : null}
          </div>
          <button type="submit" className={style.loginBtn}>
            Login
          </button>
        </form>
      </div>
    </>
  );
};

export default Login;
