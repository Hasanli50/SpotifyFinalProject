import axiosInstance from "../axiosInstance.js";
import { BASE_URL, ENDPOINT } from "../endpoint.js";

export const getAllNonDeletedArtists = async () => {
  try {
    const response = await axiosInstance.get(
      `${BASE_URL + ENDPOINT.artists}/nonDeletedArtists`
    );
    const filteredArtist = response.data.data.filter(
      (user) => user.isDeleted === false
    );
    return filteredArtist;
  } catch (error) {
    console.error("Error fetching all users: ", error);
  }
};

export const getAllDeletedArtists = async () => {
  try {
    const response = await axiosInstance.get(
      `${BASE_URL + ENDPOINT.artists}/deletedArtists`
    );
    const filteredArtist = response.data.data.filter(
      (user) => user.isDeleted === true
    );
    return filteredArtist;
  } catch (error) {
    console.error("Error fetching all users: ", error);
  }
};

export const getArtistById = async (id) => {
  try {
    const response = await axiosInstance.get(
      `${BASE_URL + ENDPOINT.artists}/${id}`
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching all users: ", error);
  }
};

export const register = async (newArtist) => {
  try {
    const formData = new FormData();

    formData.append("username", newArtist.username);
    formData.append("email", newArtist.email);
    formData.append("password", newArtist.password);

    if (newArtist.image && newArtist.image instanceof File) {
      formData.append("image", newArtist.image);
    }
    // console.log("FormData before sending:");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    const response = await axiosInstance.post(
      `${BASE_URL + ENDPOINT.artists}/register`,
      formData
    );
    console.log("response", response.data )
    const { token } = response.data.data;
    localStorage.setItem("authToken", token);
    return response.data.data;
  } catch (error) {
    console.error("Error in create user: ", error);
    throw error;
  }
};

export const updateArtistInfo = async (id, updatedArtist) => {
  try {
    const response = await axiosInstance.patch(
      `${BASE_URL + ENDPOINT.artists}/update-info/${id}`,
      updatedArtist
    );
    return response.data.data;
  } catch (error) {
    console.error(`Error patching product with ID ${id}:`, error);
  }
};

export const verifyAccount = async (id) => {
  try {
    const response = await axiosInstance.get(
      `${BASE_URL + ENDPOINT.artists}/verify/${id}`
    );
    return response.data.data;
  } catch (error) {
    console.error("Error in verify accaount", error);
  }
};

export const login = async (values) => {
  try {
    const response = await axiosInstance.post(
      `${BASE_URL + ENDPOINT.artists}/login`, values
    );
    console.log("Response: ",response.data)
    return response.data;
  } catch (error) {
    console.error("Error in login", error);
  }
};
