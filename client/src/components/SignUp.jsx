import { LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import style from "../assets/style/register.module.scss";
import GoogleIcon from "../assets/image/icon/GoogleIcon";
import { Link } from "react-router";
import { Input } from "antd";

const SignUp = () => {
  return (
    <>
      <div className={style.card}>
        <div className={style.top}>
          <Link to={"/register"} className={`${style.letter} ${style.signUp}`}>
            <p>Sign Up</p>
          </Link>

          <Link to={"/login"} className={style.letter}>
            <p>Login</p>
          </Link>
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

          <div className={style.field} style={{ position: "relative" }}>
            <label className={style.label} htmlFor="pass">
              Email:{" "}
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
              placeholder="Enter Your Email"
              prefix={<MailOutlined />}
            />
          </div>

          <button className={style.loginBtn}>Sign Up</button>
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

export default SignUp;
