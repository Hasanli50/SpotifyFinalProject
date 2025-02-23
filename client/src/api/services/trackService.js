import axiosInstance from "../axiosInstance.js";
import { BASE_URL, ENDPOINT } from "../endpoint.js";

export const getAllTracks = async () => {
  try {
    const response = await axiosInstance.get(`${BASE_URL + ENDPOINT.tracks}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching all albums: ", error);
  }
};
