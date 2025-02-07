import { LockOutlined, UserOutlined } from "@ant-design/icons";
import style from "../assets/style/login.module.scss";
import GoogleIcon from "../assets/image/icon/GoogleIcon";
import { useState } from "react";
import { Input } from "antd";
// import { Link } from "react-router";

const Login = () => {
  const [activeTab, setActiveTab] = useState("signup");

  return (
    <>
      <div className={style.card}>
        <div className={style.top}>
          {/* <Link to={"/sign-up"}> */}
            <p
              className={`${style.letter} ${
                activeTab === "signup" ? style.active : ""
              }`}
              onClick={() => setActiveTab("signup")}
            >
              Sign Up
            </p>
          {/* </Link> */}

          {/* <Link to={"/login"}> */}
            <p
              className={`${style.letter} ${
                activeTab === "login" ? style.active : ""
              }`}
              onClick={() => setActiveTab("login")}
            >
              Login
            </p>
          {/* </Link> */}
        </div>
        <form className={style.form}>
          <div className={style.field} style={{ position: "relative" }}>
            <label className={style.label} htmlFor="username">
              Username:
            </label>
            <Input
              className={style.input}
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
          </div>
          <div className={style.field} style={{ position: "relative" }}>
            <label className={style.label} htmlFor="pass">
              Password:{" "}
            </label>
            <Input
              className={style.input}
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
          </div>
          <button className={style.loginBtn}>Login</button>
          <div className={style.orBox}>
            <p className={style.or}>Or</p>
          </div>
          <button className={style.googleBtn}>
            <GoogleIcon />
            <span className={style.red}>Sign</span>
            <span className={style.yellow}>Up</span>
            <span className={style.green}>With</span>
            <span className={style.blue}>Google</span>
          </button>
        </form>
      </div>
    </>
  );
};

export default Login;
