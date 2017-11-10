import { SHOWPOSTANSWER } from '../types';

const state = {
  showPostAnswer: {
    show: false,
    question: 0,
    answer_id: 0,
    callback: null,
    body: ''
  }
};

const mutations = {
  [SHOWPOSTANSWER] (state, data) {
    state.showPostAnswer = { ...state.showPostAnswer, ...data };
  }
};

const actions = {
  [SHOWPOSTANSWER] (context, cb) {
    cb ( data => {
      context.commit(SHOWPOSTANSWER, data);
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