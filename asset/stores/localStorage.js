const getLocalItem = (item) => {
  return JSON.parse(window.localStorage.getItem(item)) || [];
};

const setLocalItem = (item, obj) => {
  window.localStorage.setItem(item,JSON.stringify(obj));
};

const clearLocalItem = (item) => {
  window.localStorage.removeItem(item);
};

export default {
  getLocalItem, setLocalItem, clearLocalItem
};
