import axios from "axios";
import { BASE_URL, ENDPOINT } from "../api/endpoint.js";

export const fetchArtistByToken = async (token) => {
  try {
    const response = await axios.get(`${BASE_URL + ENDPOINT.artists}/token`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error) {
    console.log("Error:", error.response ? error.response.data : error.message);
    throw error;
  }
};


export const fetcAdminByToken = async (token) => {
  try {
    const response = await axios.get(`${BASE_URL + ENDPOINT.users}/token`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.data.data.role === "admin") {
      return response.data.data;
    }
  } catch (error) {
    console.log("Error:", error);
    throw error;
  }
};

export const fetchUserByToken = async (token) => {
  try {
    const response = await axios.get(`${BASE_URL + ENDPOINT.users}/token`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error) {
    console.log("Error:", error);
    throw error;
  }
};

export function formatDuration(durationInSeconds) {
  const minutes = Math.floor(durationInSeconds / 60);
  const seconds = durationInSeconds % 60;
  return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
}
