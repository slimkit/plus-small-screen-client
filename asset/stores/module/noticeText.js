import { NOTICE } from '../types';

const state = {
  text: '',
  status: true,
  time: 1000,
  show: false
};

const mutations = {
  [NOTICE] (state, notice) {
    notice.show = notice.text.length ? true : false;
    state = { ...state, ...notice };
  }
};

const actions = {
  [NOTICE]: (context, cb) => {
    cb( (notice) => {
      context.commit(NOTICE, notice);
    });
  }
};

const getters = {
  [NOTICE]: (state) => state
};

const store = {
  state,
  mutations,
  actions,
  getters
};

export default store;