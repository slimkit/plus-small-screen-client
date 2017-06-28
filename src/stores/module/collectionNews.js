import { COLLECTIONNEWS, ADDCOLLECTIONNEWS, UNCOLLECTIONNEWS, COLLECTIONTYPE } from '../types';

const state = {
  collectionnews: [],
  collectionType: '',
};

const mutations = {
  [ADDCOLLECTIONNEWS] (state, news) {
    state.collectionnews = [ ...state.collectionnews, news ];
  },

  [COLLECTIONNEWS] (state, news) {
    state.collectionnews = [ ...news ];
  },

  [COLLECTIONTYPE] (state, type) {
    state.collectionType = type;
  }
};

const actions = {
  [ADDCOLLECTIONNEWS]: (context, cb) => {
    cb( news => {
      if(context.state.collectionnews.findIndex( item => {
        return item.id === news.id;
      }) === -1) {
        context.commit(ADDCOLLECTIONNEWS, news);
      }
    });
  },

  [UNCOLLECTIONNEWS]: (context, cb) => {
    cb ( id => {
      let index = context.state.collectionnews.findIndex( item => { return item.id === id; });
      if(index !== -1) {
        let news = context.state.collectionnews.splice(index, 1);
        context.commit(COLLECTIONNEWS, news);
      }
    })
  },
  [COLLECTIONTYPE]: (context, cb) => {
    cb( type => {
      if(context.state.collectionType !== type) {
        context.commit(COLLECTIONTYPE, type);
      }
    })
  }
};

const getters = {
  [COLLECTIONNEWS]: state => {
    return state.collectionnews;
  },
  [COLLECTIONTYPE]: state => {
    return state.collectionType;
  }
}

const store = {
  state,
  mutations,
  actions,
  getters
};

export default store;