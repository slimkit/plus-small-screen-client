import axios from 'axios';
import localEvent from '../stores/localStorage';

const baseURL = `http://192.168.199.235`;
const api = `http://192.168.199.235/api/v1`;
const UserLoginInfo = localEvent.getLocalItem('UserLoginInfo');

// Export a method to create the requested address.
export const createRequestURI = PATH => `${baseURL}/${PATH}`;

// Created the request address of API.
export const createAPI = PATH => `${api}/${PATH}`;

// 注入access-token验证
export const addAccessToken = () => {
  axios.defaults.headers.common = {
    'ACCESS-TOKEN': UserLoginInfo.token
  };
  return axios;
};

export default axios;