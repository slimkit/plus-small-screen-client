import { SHOWPINNEDMODAL, CLOSEPINNEDMODAL } from '../types';

const state = {
  showPopup: {
    show: false,
  }
};

const mutations = {
  [SHOWPINNEDMODAL] (state, data) {
    state.showPopup = { ...data };
  }
};

const actions = {
  [SHOWPINNEDMODAL]: (context, cb) => {
    cb( data => {
      context.commit(SHOWPINNEDMODAL, data);
    })
  },
  [CLOSEPINNEDMODAL]: context => {
    context.commit(SHOWPINNEDMODAL, {
      show: false, 
    });
  }
};

const getters = {
  [SHOWPINNEDMODAL]: state => {
    return state.showPopup;
  }
};

const store = {
  state,
  mutations,
  actions,
  getters
};

export default store;