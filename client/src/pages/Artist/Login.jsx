import { LockOutlined, UserOutlined } from "@ant-design/icons";
import style from "../../assets/style/login.module.scss";
import GoogleIcon from "../../assets/image/icon/GoogleIcon";
import { Input } from "antd";
import { Link, useLocation, useNavigate } from "react-router";
import { useFormik } from "formik";
import { loginSchema } from "../../schema/loginSchema";
import toast from "react-hot-toast";
import { BASE_URL, ENDPOINT } from "../../api/endpoint";
import axios from "axios";
import { saveUserToStorage } from "../../utils/localeStorage";
import { useEffect } from "react";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getTokenFromQuery = () => {
    const queryParams = new URLSearchParams(location.search);
    return queryParams.get("token");
  };

  useEffect(() => {
    const token = getTokenFromQuery();
    if (token) {
      saveUserToStorage(token);
      localStorage.setItem("artistauth", "true");
      toast.success("Successfully signed in with Google!");

      setTimeout(() => {
        navigate("/artist");
      }, 300);
    }
  }, [location.search, navigate]);

  const handleGoogleLogin = () => {
    window.location.href = `https://spotifyfinalproject-6.onrender.com/auth-artist/google`;
  };

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

        const response = await axios.post(
          `${BASE_URL + ENDPOINT.artists}/login`,
          cleanedValues
        );

        if (response?.data?.token) {
          actions.resetForm();
          toast.success("Successfully signed in!");
          localStorage.setItem("artistauth", "true");
          saveUserToStorage(response.data.token);
          setTimeout(() => {
            navigate("/artist");
          }, 300);
        } else {
          toast.error("Login failed. Please try again.");
        }
      } catch (error) {
        console.log("Error: ", error);
        toast.error(error.response?.data?.message || "Login failed.");
      }
    },
    validationSchema: loginSchema,
  });

  return (
    <div className={style.card}>
      <div className={style.top}>
        <Link to={"/artist/register"} className={style.letter}>
          <p>Sign Up</p>
        </Link>

        <Link to={"/artist/login"} className={`${style.letter} ${style.login}`}>
          <p>Login</p>
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
        <Link to={"/artist/forgot-password"} className={style.pass}>
          <p>Forgot Password?</p>
        </Link>
        <button type="submit" className={style.loginBtn}>
          Login
        </button>

        <div className={style.orBox}>
          <p className={style.or}>Or</p>
        </div>
        {/* <Link to={"/auth/google"} style={{textDecoration: "none"}}> */}
        <button className={style.googleBtn} onClick={handleGoogleLogin}>
          <GoogleIcon />
          <span className={style.red}>Login</span>
          <span className={style.yellow}>With</span>
          <span className={style.blue}>Google</span>
        </button>
        {/* </Link> */}
      </form>
    </div>
  );
};

export default Login;
