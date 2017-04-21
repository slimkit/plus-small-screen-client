import { NOTICE } from '../types';

const state = {
  notice: {
    text: '',
    status: true,
    time: 1000,
    show: false
  }
  
};

const mutations = {
  [NOTICE] (state, notice) {
    notice.show = notice.text.length ? true : false;
    state.notice = { ...state.notice, ...notice };
  }
};

const actions = {
  [NOTICE]: (context, cb) => {
    cb( (notice) => {
      context.commit(NOTICE, notice);
      if(notice.show && !(notice.time < 1000)) {
        setTimeout(() => {
          context.commit(NOTICE, {
            ...notice,
            show: false,
            time: 1000,
            text: ''
          });
        }, notice.time)
      }
    });
  }
};

const getters = {
  [NOTICE]: (state) => state.notice
};

const store = {
  state,
  mutations,
  actions,
  getters
};

export default store;