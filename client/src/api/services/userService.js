import axiosInstance from "../axiosInstance.js";
import { BASE_URL, ENDPOINT } from "../endpoint.js";

export const getAllNonDeletedUsers = async () => {
  try {
    const response = await axiosInstance.get(
      `${BASE_URL + ENDPOINT.users}/nonDeletedUsers`
    );
    const filteredUser = response.data.data.filter(
      (user) => user.isDeleted === false
    );
    return filteredUser;
  } catch (error) {
    console.error("Error fetching all users: ", error);
  }
};

export const getAllDeletedUsers = async () => {
  try {
    const response = await axiosInstance.get(
      `${BASE_URL + ENDPOINT.users}/deletedUsers`
    );
    const filteredUser = response.data.data.filter(
      (user) => user.isDeleted === true
    );
    return filteredUser;
  } catch (error) {
    console.error("Error fetching all users: ", error);
  }
};

export const getUserById = async (id) => {
  try {
    const response = await axiosInstance.get(
      `${BASE_URL + ENDPOINT.users}/${id}`
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching all users: ", error);
  }
};

export const register = async (newUser) => {
  try {
    const response = await axiosInstance.post(
      `${BASE_URL + ENDPOINT.users}/register`,
      newUser
    );
    return response.data.data;
  } catch (error) {
    console.error("Error in create user: ", error);
  }
};

export const updateUserInfo = async (id, updatedUser) => {
  try {
    const response = await axiosInstance.patch(
      `${BASE_URL + ENDPOINT.users}/update-info/${id}`,
      updatedUser
    );
    return response.data.data;
  } catch (error) {
    console.error(`Error patching product with ID ${id}:`, error);
  }
};

export const verifyAccount = async (token) => {
  try {
    const response = await axiosInstance.get(
      `${BASE_URL + ENDPOINT.users}/verify/${token}`
    );
    return response.data.data;
  } catch (error) {
    console.error("Error in verify accaount", error);
  }
};

export const deleteAccount = async (id) => {
  try {
    const response = await axiosInstance.delete(
      `${BASE_URL + ENDPOINT.users}/delete-account/${id}`
    );
    return response.data.data;
  } catch (error) {
    console.error("Error in delete accaunt", error);
  }
};

export const freezeAccount = async (id) => {
  try {
    const response = await axiosInstance.patch(
      `${BASE_URL + ENDPOINT.users}/freeze-account/${id}`
    );
    return response.data.data;
  } catch (error) {
    console.error("Error in freeze accaunt", error);
  }
};

export const unfreezeAccount = async (id) => {
  try {
    const response = await axiosInstance.patch(
      `${BASE_URL + ENDPOINT.users}/unfreeze-account/${id}`
    );
    return response.data.data;
  } catch (error) {
    console.error("Error in unfreeze accaunt", error);
  }
};

export const banAccount = async (id) => {
  try {
    const response = await axiosInstance.patch(
      `${BASE_URL + ENDPOINT.users}/ban-account/${id}`
    );
    return response.data.data;
  } catch (error) {
    console.error("Error in ban accaunt", error);
  }
};

export const unBanAccount = async (id) => {
  try {
    const response = await axiosInstance.patch(
      `${BASE_URL + ENDPOINT.users}/unban-account/${id}`
    );
    return response.data.data;
  } catch (error) {
    console.error("Error in unfreeze accaunt", error);
  }
};

export const resetPassword = async (token) => {
  try {
    const response = await axiosInstance.post(
      `${BASE_URL + ENDPOINT.users}/reset-password/${token}`
    );
    return response.data.data;
  } catch (error) {
    console.error("Error in reset password", error);
  }
};

export const forgotPassword = async () => {
  try {
    const response = await axiosInstance.post(
      `${BASE_URL + ENDPOINT.users}/forgot-password`
    );
    return response.data.data;
  } catch (error) {
    console.error("Error in forgot password", error);
  }
};

export const updatePassword = async (id) => {
  try {
    const response = await axiosInstance.patch(
      `${BASE_URL + ENDPOINT.users}/update-password/${id}`
    );
    return response.data.data;
  } catch (error) {
    console.error("Error in update password", error);
  }
};

export const login = async () => {
  try {
    const response = await axiosInstance.post(
      `${BASE_URL + ENDPOINT.users}/login`
    );
    return response.data.data;
  } catch (error) {
    console.error("Error in login", error);
  }
};
