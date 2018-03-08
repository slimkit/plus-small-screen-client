import { COMMENTINPUT, CLOSECOMMENTINPUT, CLOSEPOPUP, SHOWPOPUP } from '../types';

const state = {
  commentFeed: 0,
  showPopup: {
    show: false,
    feed_id: 0,
    me: false,
    isCollection: 0
  }
};

const mutations = {
  [COMMENTINPUT] (state, feed_id) {
    state.commentFeed = feed_id;
  },
  [SHOWPOPUP] (state, data) {
    state.showPopup = { ...data };
  }
};

const actions = {
  [COMMENTINPUT]: (context, cb) => {
    cb( feed_id => {
      context.commit(COMMENTINPUT, feed_id);
    })
  },
  [SHOWPOPUP]: (context, cb) => {
    cb( data => {
      context.commit(SHOWPOPUP, data);
    })
  },
  [CLOSEPOPUP]: context => {
    context.commit(SHOWPOPUP, {
      show: false, 
      feed_id: 0, 
      me: false,
      isCollection: 0
    });
  }
  ,
  [CLOSECOMMENTINPUT]: context => {
    context.commit(COMMENTINPUT, 0)
  }
};

const getters = {
  [COMMENTINPUT]: state => {
    return state.commentFeed
  },
  [SHOWPOPUP]: state => {
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