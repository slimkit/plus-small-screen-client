import { CURRENTNEWSCATEID, NEWSSEARCHKEY, NEWSSEARCHRESULT, APPENDNEWSTORESULT, PREPENDNEWSTORESULT, RESETKEYWORD, RESULTIDS } from '../types';

const state = {
  newsAbout: {
    currentnewscateid: 0,
    searchKey: '',
    searchResult: [],
    resultIds: [],
    storeSearched: false
  }
};

const mutations = {
  [CURRENTNEWSCATEID] (state, cateid) {
    state.newsAbout.currentnewscateid = cateid;
  },

  [NEWSSEARCHKEY] (state, keyword) {
    state.newsAbout.searchKey = keyword;
    state.newsAbout.storeSearched = true;
  },

  [NEWSSEARCHRESULT] (state, result) {
    state.newsAbout.searchResult = result;
  },

  [APPENDNEWSTORESULT] (state, result) {
    state.newsAbout.searchResult = [ ...state.newsAbout.searchResult, result ];
  },

  [PREPENDNEWSTORESULT] (state, result) {
    state.newsAbout.searchResult = [ result, ...state.newsAbout.searchResult ];
  },
  [RESULTIDS] (state, ids) {
    state.newsAbout.resultIds = [ ...ids ];
  },

  [RESETKEYWORD] (state) {
    state.newsAbout.searchResult = [];
    state.newsAbout.searchKey = '';
    state.newsAbout.resultIds = [];
    state.newsAbout.storeSearched = false;
  }
};

const actions = {
  [CURRENTNEWSCATEID]: (context, cb) => {
    cb( cateid => {
      context.commit(CURRENTNEWSCATEID, cateid);
    });
  },
  [NEWSSEARCHKEY]: (context, cb) => {
    cb( keyword => {
      context.commit(NEWSSEARCHKEY, keyword);
    })
  },
  [NEWSSEARCHRESULT]: (context, cb) => {
    cb( result => {
      context.commit(NEWSSEARCHRESULT, result);
    })
  },
  [APPENDNEWSTORESULT]: (context, cb) => {
    cb( result => {
      if( context.state.newsAbout.searchResult.findIndex( item => {
        return item.id === result.id;
      }) === -1) {
        context.commit(APPENDNEWSTORESULT, result);
      }
    })
  },
  [PREPENDNEWSTORESULT]: (context, cb) => {
    cb( result => {
      if( context.state.newsAbout.searchResult.findIndex( item => {
        return item.id === result.id;
      }) === -1) {
        context.commit(PREPENDNEWSTORESULT, result);
      }
    })
  },
  [RESULTIDS]: (context, cb) => {
    cb( ids => {
      let newIds = context.state.newsAbout.resultIds.concat(ids);
      newIds = Array.from(new Set(newIds));
      context.commit(RESULTIDS, newIds);
    })
  },
  [RESETKEYWORD]: context => {
    context.commit(RESETKEYWORD);
  }
};

const getters = {
  [CURRENTNEWSCATEID]: state => {
    return state.newsAbout.currentnewscateid;
  }
};

const store = {
  mutations,
  actions,
  getters,
  state
};

export default store;