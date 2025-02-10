const KEY = "id";

export const saveUserToStorage = (id) => {
  localStorage.setItem(KEY, JSON.stringify(id));
};

export const removeUserFromStorage = () => {
  localStorage.removeItem(KEY);
};

export const getUserFromStorage = () => {
  const data = localStorage.getItem(KEY);
  data ? JSON.parse(data) : null;
};
