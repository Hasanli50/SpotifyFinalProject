import axiosInstance from "../axiosInstance.js";
import { BASE_URL, ENDPOINT } from "../endpoint.js";

export const fetchAllGenres = async () => {
  try {
    const response = await axiosInstance.get(BASE_URL + ENDPOINT.genres);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching all genres:", error);
    throw error;
  }
};

export const fetchGenreById = async (id) => {
  try {
    const response = await axiosInstance.get(
      `${BASE_URL + ENDPOINT.users}/${id}`
    );
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching product with ID ${id}:`, error);
    throw error;
  }
};

export const fetchTracksByGenre = async (id) => {
  try {
    const genres = await axiosInstance.get(
      `${BASE_URL + ENDPOINT.genres}/${id}`
    );
    const tracks = await axiosInstance.get(`${BASE_URL + ENDPOINT.tracks}`);
    const filteredData = tracks.data.data.filter(
      (track) => track.genreId === genres.data.data.id
    );
    return filteredData;
  } catch (error) {
    console.error(`Error fetching product with ID ${id}:`, error);
    throw error;
  }
};
