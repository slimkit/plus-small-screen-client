import axios from 'axios';
import errorCodes from '../stores/errorCodes';
import {
  NOTICE,
  SHOWPOST,
  SHOWFEEDDIGGSLISTS
} from '../stores/types';
import app from '../index';
import storeLocal from 'store';

const {
  apiv1,
  api,
  url: baseURL
} = window.TS_WEB;

// Export a method to create the requested address.
export const createRequestURI = PATH => `${baseURL}/${PATH}`;

// Created the request address of API.
export const createAPI = PATH => `${api}/${PATH}`;

export const createOldAPI = PATH => `${apiv1}/${PATH}`;

// 注入access-token验证
export const addAccessToken = () => {
  // 如果有才发送
  const {
    token = ''
  } = storeLocal.get('UserLoginInfo') || {};
  let _token = token ? `Bearer ${token}` : '';
  axios.defaults.headers.common = {
    'Authorization': _token,
    'Accept': 'application/json'
  };
  return axios;
};

axios.interceptors.response.use(
  function(response) {
    //对响应数据做些事
    return response;
  },
  function (error) {
    if (error.response.status === 401) {
      app.$store.dispatch(NOTICE, cb => {
        cb({
          show: true,
          time: 1500,
          status: false,
          text: '请登录...'
        });
      });
      setTimeout( () => {
        app.$router.push('/login');
      }, 1500);
      return false;
    }
    return Promise.reject(error);
  }
);

export default axios;