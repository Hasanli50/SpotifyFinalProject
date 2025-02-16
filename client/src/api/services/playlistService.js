import { getUserFromStorage } from "../../utils/localeStorage.js";
import axiosInstance from "../axiosInstance.js";
import { BASE_URL, ENDPOINT } from "../endpoint.js";

const token = getUserFromStorage();

export const fetchALlPlaylists = async () => {
  try {
    const response = await axiosInstance.get(
      `${BASE_URL + ENDPOINT.playlists}/all-playlists`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
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
