const localEvent = {
  getLocalItem: (item) => {
    return JSON.parse(window.localStorage.getItem('TS+_' + item)) || [];
  },

  setLocalItem: (item, obj) => {
    window.localStorage.setItem('TS+_' + item,JSON.stringify(obj));
  },

  clearLocalItem: (item) => {
    window.localStorage.removeItem('TS+_' + item);
  },

  clearLocalAll: () => {
    window.localStorage.clear();
  }
}

export default localEvent;

