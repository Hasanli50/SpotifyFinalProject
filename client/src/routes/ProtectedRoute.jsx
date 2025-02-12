/* eslint-disable react/prop-types */
import { Navigate } from "react-router"; 
import { getUserFromStorage } from "../utils/localeStorage";

//for artist
export const isAuthArtist = () => {
    return localStorage.getItem("teacherauth") === "true";
};

const ProtectedRoute = ({children}) => {
  const user = getUserFromStorage(); 
  return isAuthArtist() && user ? children : <Navigate to={"/artist/login"} replace/>
}

//for user

export default ProtectedRoute