import { COMMENTINPUT, CLOSECOMMENTINPUT } from '../types';

const state = {
  commentFeed: 0
};

const mutations = {
  [COMMENTINPUT] (state, feed_id) {
    state.commentFeed = feed_id;
  }
};

const actions = {
  [COMMENTINPUT]: (context, cb) => {
    cb( feed_id => {
      context.commit(COMMENTINPUT, feed_id);
    })
  },
  [CLOSECOMMENTINPUT]: context => {
    context.commit(COMMENTINPUT, 0)
  }
};

const getters = {
  [COMMENTINPUT]: state => {
    return state.commentFeed
  }
};

const store = {
  state,
  mutations,
  actions,
  getters
};

export default store;