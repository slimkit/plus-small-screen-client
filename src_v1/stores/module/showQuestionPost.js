import { SHOWQUESTIONPOST } from '../types';

const state ={
  showQuestionPost: {
    show: false,
    id: 0,
    callback: null
  }
};

const mutations = {
  [SHOWQUESTIONPOST] (state, data) {
    state.showQuestionPost = { ...state.showQuestionPost, ...data};
  }
};

const actions = {
  [SHOWQUESTIONPOST] (context, cb) {
    cb ( data => {
      context.commit(SHOWQUESTIONPOST, data);
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