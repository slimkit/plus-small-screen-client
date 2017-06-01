import { COMMENTINPUT, CLOSECOMMENTINPUT } from '../types';
// 关闭
const close = dispatch => dispatch(CLOSECOMMENTINPUT);
// 回调
const cb = close;
const handler = function() {
  event.preventDefault();
}
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
    // if(TS_WEB.isIos) {
      if(info.data.show) {
        document.getElementById('app').addEventListener('touchmove', handler, false);
      } else {
        document.getElementById('app').removeEventListener('touchmove', handler, false);
      }
    // }
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