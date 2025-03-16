/* eslint-disable react/prop-types */
import { Navigate } from "react-router";
import { getUserFromStorage } from "../utils/localeStorage";

const isAuthArtist = () => {
  return localStorage.getItem("artistauth") === "true";
};

const ProtectedRouteArtist = ({ children }) => {
  const user = getUserFromStorage();
  const candition =
    isAuthArtist() && user ? (
      children
    ) : (
      <Navigate to={"/artist/login"} replace />
    );
  return candition;
};

export default ProtectedRouteArtist;
