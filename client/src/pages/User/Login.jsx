import { LockOutlined, UserOutlined } from "@ant-design/icons";
import style from "../../assets/style/login.module.scss";
import GoogleIcon from "../../assets/image/icon/GoogleIcon";
import { Input } from "antd";
import { Link, useNavigate, useParams } from "react-router";
import { useFormik } from "formik";
import { loginSchema } from "../../schema/loginSchema";
import toast from "react-hot-toast";
import { BASE_URL, ENDPOINT } from "../../api/endpoint";
import axios from "axios";
import { saveUserToStorage } from "../../utils/localeStorage";
import { useEffect } from "react";
import { useAllNonDeletedUsers } from "../../hooks/useUser";

const Login = () => {
  const { data } = useAllNonDeletedUsers();
  const navigate = useNavigate();
  const { token } = useParams();

  useEffect(() => {
    if (token) {
      saveUserToStorage(token); // Save token to localStorage
      toast.success("Successfully signed in with Google!");

      setTimeout(() => {
        navigate("/");
      }, 300);
    }
  }, [token, navigate]);

  const handleGoogleLogin = () => {
    window.location.href = `http://localhost:6060/auth-user/google`; // Redirect to Google OAuth
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

        const user = data.find(
          (user) => user.username === cleanedValues.username
        );
        if (!user) {
          toast.error("Incorrect username. Please try again.");
          return;
        }

        if (user.isVerified !== true) {
          toast.error("Please check your email and verify your account");
          return;
        }

        if (user.isBanned === true) {
          const banExpiresAt = new Date(user.banExpiresAt).getTime();

          if (isNaN(banExpiresAt)) {
            console.error("Invalid ban expiration time:", user.banExpiresAt);
            return toast.error("Invalid ban expiration time.");
          }
          const remainingMilliseconds = banExpiresAt - Date.now();

          const remainingMinutes = Math.floor(
            remainingMilliseconds / (1000 * 60)
          );
          const remainingSeconds = Math.floor(
            (remainingMilliseconds % (1000 * 60)) / 1000
          );

          return toast.error(
            `Your account is banned. Come back after ${remainingMinutes} minutes and ${remainingSeconds} seconds.`
          );
        }

        if (user.role !== "user") {
          toast.error("Only users can login!");
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
          // console.log(response.data.token);

          setTimeout(() => {
            navigate("/");
          }, 300);
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
    <div className={style.card}>
      <div className={style.top}>
        <Link to={"/register"} className={style.letter}>
          <p>Sign Up</p>
        </Link>

        <Link to={"/login"} className={`${style.letter} ${style.login}`}>
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
        <Link to={"/forgot-password"} className={style.pass}>
          <p>Forgot Password?</p>
        </Link>
        <button type="submit" className={style.loginBtn}>
          Login
        </button>

        <div className={style.orBox}>
          <p className={style.or}>Or</p>
        </div>
        {/* <Link to={"/auth/google"} style={{textDecoration: "none"}}> */}
        <button
          className={style.googleBtn}
          onClick={handleGoogleLogin}
          type="button"
        >
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
