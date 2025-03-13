import { Link, useParams } from "react-router";
import style from "../../assets/style/verifyAccount.module.scss";
import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL, ENDPOINT } from "../../api/endpoint";
import { Helmet } from "react-helmet-async";

const VerifyAccount = () => {
  const { token } = useParams();
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("pending");

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL + ENDPOINT.users}/verify/${token}`
        );
        setStatus("success");
        setMessage(response.data.message);
      } catch (error) {
        setStatus("fail");
        setMessage(
          error?.response?.data?.message ||
            "An error occurred while verifying your account"
        );
      }
    };

    verifyUser();
  }, [token]);

  return (
    <>
      <Helmet>
        <title>Verify Account</title>
      </Helmet>
      <div className={style.box}>
        <div className={style.imgBox}></div>
        <h2 className={style.heading}>
          {status === "success" ? "Congratulations!" : "Oops!"}
        </h2>
        <p className={style.paragraph}>{message}</p>
        {status === "success" && (
          <Link to={"/login"} style={{ textDecoration: "none" }}>
            <button className={style.btn}>Login</button>
          </Link>
        )}
      </div>
    </>
  );
};

export default VerifyAccount;
