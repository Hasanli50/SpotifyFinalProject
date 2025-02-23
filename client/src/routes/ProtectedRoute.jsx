/* eslint-disable react/prop-types */
import { Navigate } from "react-router";
import { getUserFromStorage } from "../utils/localeStorage";
import Login from "../pages/User/Login";

//for artist
export const isAuthArtist = () => {
  return localStorage.getItem("artistauth") === "true";
};

const ProtectedRoute = ({ children }) => {
  const user = getUserFromStorage();
  const candition =
    isAuthArtist() && user ? (
      children
    ) : (
      <Navigate to={"/artist/login"} replace />
    );
  return candition;
};

//-----------------------------------------------------------
//for admin
export const isAuthAdmin = () => {
  return localStorage.getItem("adminauth") === "true";
};

const ProtectedRouteAdmin = ({ children }) => {
  const user = getUserFromStorage();
  const candition =
    isAuthAdmin() && user ? children : <Navigate to={"/admin/login"} replace />;
  return candition;
};

//------------------------------------------------------------
// for user
export const isAuthUser = () => {
  return localStorage.getItem("userauth") === "true";
};

const UserLoginRedirect = () => {
  if (isAuthUser()) {
    return <Navigate to="/" replace />;
  }

  return <Login />;
};

export { ProtectedRoute, ProtectedRouteAdmin, UserLoginRedirect };
