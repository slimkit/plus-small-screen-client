import { IMGSWIPER } from '../types';

const state = {
  imageSwiper: {
    list: [],
    value: 0,
    show: false
  }
};

const mutations = {
  [IMGSWIPER] (state, images) {
      state.imageSwiper = { ...state.imageSwiper, ...images };
  }
};

const actions = {
  [IMGSWIPER]: (context, cb) => {
    cb( (images) => {
      context.commit(IMGSWIPER, images);
    });
  }
};

const getters = {

}

const store = {
  state,
  mutations,
  actions,
  getters
};

export default store;