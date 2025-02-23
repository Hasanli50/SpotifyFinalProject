import axiosInstance from "../axiosInstance.js";
import { BASE_URL, ENDPOINT } from "../endpoint.js";

export const getAllAlbums = async () => {
  try {
    const response = await axiosInstance.get(
      `${BASE_URL + ENDPOINT.albums}`
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching all albums: ", error);
  }
};