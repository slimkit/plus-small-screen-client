import { SHOWQUESTIONPOST } from '../types';

const state ={
  showQuestionPost: {
    show: false
  }
};

const mutations = {
  [SHOWQUESTIONPOST] (state, show) {
    state.showQuestionPost = { ...state.showQuestionPost, ...{ show }};
  }
};

const actions = {
  [SHOWQUESTIONPOST] (context, cb) {
    cb ( (show) => {
      context.commit(SHOWQUESTIONPOST, show);
    })
  }
};

const getters = {

};

const store = {
  state,
  mutations,
  actions,
  getters
};

export default store;