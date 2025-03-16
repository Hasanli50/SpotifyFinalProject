/* eslint-disable react/prop-types */
import { Navigate } from "react-router";
import { useEffect, useState } from "react";

const isAuthAdmin = () => {
  return localStorage.getItem("adminauth") === "true";
};

const ProtectedRouteAdmin = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(isAuthAdmin());

  useEffect(() => {
    console.log("Admin Auth Status:", isAuthAdmin());
    setIsAuthenticated(isAuthAdmin());
  }, []);

  if (!isAuthenticated) {
    console.log("Redirecting to Admin Login...");
    return <Navigate to={"/admin/login"} replace />;
  }

  return children;
};

export default ProtectedRouteAdmin;
