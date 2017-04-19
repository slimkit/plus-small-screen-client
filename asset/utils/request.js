import axios from 'axios';
import localEvent from '../stores/localStorage';
const { api, url: baseURL } = window.TS_WEB;

// Export a method to create the requested address.
export const createRequestURI = PATH => `${baseURL}/${PATH}`;

// Created the request address of API.
export const createAPI = PATH => `${api}/${PATH}`;

// 注入access-token验证
export const addAccessToken = () => {
  const UserLoginInfo = localEvent.getLocalItem('UserLoginInfo');
  axios.defaults.headers.common = {
    'ACCESS-TOKEN': UserLoginInfo.token
  };
  return axios;
};

export default axios;