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

export const getFavorites = () => {
  const favorites = localStorage.getItem("favorites");
  return favorites ? JSON.parse(favorites) : [];
};

export const addFavorite = (songId) => {
  const favorites = getFavorites();
  if (!favorites.includes(songId)) {
    favorites.push(songId);
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }
};

export const removeFavorite = (songId) => {
  let favorites = getFavorites();
  favorites = favorites.filter((id) => id !== songId);
  localStorage.setItem("favorites", JSON.stringify(favorites));
};

export const isFavorite = (songId) => {
  const favorites = getFavorites();
  return favorites.includes(songId);
};
