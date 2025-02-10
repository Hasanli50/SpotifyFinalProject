const KEY = "token";

export const saveUserToStorage = (token) => {
  localStorage.setItem(KEY, JSON.stringify(token));
};

export const removeUserFromStorage = () => {
  localStorage.removeItem(KEY);
};

export const getUserFromStorage = () => {
  const data = localStorage.getItem(KEY);
  data ? JSON.parse(data) : null;
};
