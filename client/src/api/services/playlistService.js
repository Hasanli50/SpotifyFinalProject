import axiosInstance from "../axiosInstance.js";
import { BASE_URL, ENDPOINT } from "../endpoint.js";

export const fetchPlaylists = async () => {
  try {
    const response = await axiosInstance.get(BASE_URL + ENDPOINT.playlists);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching all playlists: ", error);
  }
};

export const createPlaylist = async (newPlaylist) => {
  try {
    const response = await axiosInstance.post(
      `${BASE_URL + ENDPOINT.playlists}`,
      newPlaylist
    );
    return response.data.data;
  } catch (error) {
    console.error("Error in create playlist", error);
  }
};

export const getPlaylistById = async (id) => {
  try {
    const response = await axiosInstance.get(
      `${BASE_URL + ENDPOINT.playlists}/${id}`
    );
    return response.data.data;
  } catch (error) {
    console.error("Error in fetch playlist", error);
  }
};
