import axios from "axios";
import { BASE_URL } from "./endpoint.js";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("authToken");
      if (localStorage.getItem("adminauth") === "true") {
        window.location.href = "/admin/login";
      } else if (localStorage.getItem("artistauth") === "true") {
        window.location.href = "/artist/login";
      } else {
        window.location.href = "/login"; 
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
