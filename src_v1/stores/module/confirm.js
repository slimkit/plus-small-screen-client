import { CONFIRM, CONFIRMCB, CLOSECONFIRM } from '../types';

// 关闭
const close = dispatch => dispatch(CLOSECONFIRM);

// 确认
const confirm = close;

const state = {
  confirm: {
    show: false,
    confirmContent: '',
    data: {},
    close,
    confirm
  }
  
};

const mutations = {
  [CONFIRM] (state, data) {
    state.confirm = { ...state.confirm, ...data };
  }
};

const actions = {
  [CONFIRM]: (context, cb) => {
    cb( data => {
      context.commit(CONFIRM, data);
    })
  },
  [CLOSECONFIRM]: context => {
    context.commit(CONFIRM, {
      show: false,
      confirmContent: '',
      data: {},
      close,
      confirm
    })
  }
};

const getters = {
  [CONFIRM]: state => {
    return state.confirm;
  }
};

const store = {
  state,
  mutations,
  actions,
  getters
};

export default store;