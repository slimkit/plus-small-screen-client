const localEvent = {
  getLocalItem: (item) => {
    return JSON.parse(window.localStorage.getItem(item)) || [];
  },

  setLocalItem: (item, obj) => {
    window.localStorage.setItem(item,JSON.stringify(obj));
  },

  clearLocalItem: (item) => {
    window.localStorage.removeItem(item);
  }
}

export default localEvent;

