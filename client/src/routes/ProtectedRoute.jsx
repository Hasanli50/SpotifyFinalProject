/* eslint-disable react/prop-types */
import { Navigate } from "react-router";
import { getUserFromStorage } from "../utils/localeStorage";

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

//for user

export default ProtectedRoute;
