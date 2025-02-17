const KEY = "token";

export const saveUserToStorage = (token) => {
  localStorage.setItem(KEY, JSON.stringify(token));
};

export const removeArtistFromStorage = () => {
  localStorage.removeItem(KEY);
  localStorage.removeItem("artistauth");
};

export const removeAdminFromStorage = () => {
  localStorage.removeItem(KEY);
  localStorage.removeItem("adminauth");
};

export const removeUserFromStorage = () => {
  localStorage.removeItem(KEY);
  localStorage.removeItem("userauth");
};

export const getUserFromStorage = () => {
  const data = localStorage.getItem(KEY);
  return data ? JSON.parse(data) : null;
};
