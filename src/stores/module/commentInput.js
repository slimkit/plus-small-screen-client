import { COMMENTINPUT, CLOSECOMMENTINPUT } from '../types';
// 关闭
const close = dispatch => dispatch(CLOSECOMMENTINPUT);
// 回调
const cb = close;

const state = {
  commentInput: {
    data: { 
      show: false,
      reply_to_user_id: 0,
      to_user_name: '',
      feed: {}
    },
    close,
    cb
  }
};

const mutations = {
  [COMMENTINPUT] (state, info) {
    state.commentInput = { ...state.commentInput, ...info };
    if(info.show) {
      document.getElementById('html-root').style.overflow='hidden';
      document.getElementById('body-root').style.overflow='hidden';
    } else {
      document.getElementById('body-root').style.overflow='auto';
      document.getElementById('html-root').style.overflow='auto';
    }
  }
};

const actions = {
  [COMMENTINPUT]: (context, cb) => {
    cb( info => {
      context.commit(COMMENTINPUT, info);
    })
  },
  [CLOSECOMMENTINPUT]: context => {
    context.commit(COMMENTINPUT, {
      data: {
        show: false,
        reply_to_user_id: 0,
        to_user_name: '',
        feed: {}
      },
      close,
      cb
    })
  }
};

const getters = {
  [COMMENTINPUT]: state => {
    return state.commentInput;
  }
};

const store = {
  state,
  mutations,
  actions,
  getters
};

export default store;