/* eslint-disable react/prop-types */
import { Navigate } from "react-router";
import { getUserFromStorage } from "../utils/localeStorage";
import Login from "../pages/User/Login";
import { useEffect, useState } from "react";

//for artist
const isAuthArtist = () => {
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
const isAuthAdmin = () => {
  return localStorage.getItem("adminauth") === "true";
};

const ProtectedRouteAdmin = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(isAuthAdmin());

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(isAuthAdmin());
    };

    window.addEventListener("storage", handleStorageChange);

    setIsAuthenticated(isAuthAdmin());

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  if (!isAuthenticated) {
    return <Navigate to={"/admin/login"} replace />;
  }

  return children;
};

//------------------------------------------------------------
// for user
const isAuthUser = () => {
  return localStorage.getItem("userauth") === "true";
};

const UserLoginRedirect = () => {
  if (isAuthUser()) {
    return <Navigate to="/" replace />;
  }

  return <Login />;
};

export { ProtectedRoute, ProtectedRouteAdmin, UserLoginRedirect };
