import { Navigate } from "react-router";
import Login from "../pages/User/Login";

const isAuthUser = () => {
  return localStorage.getItem("userauth") === "true";
};

const UserLoginRedirect = () => {
  if (isAuthUser()) {
    return <Navigate to="/" replace />;
  }

  return <Login />;
};

export default UserLoginRedirect;
