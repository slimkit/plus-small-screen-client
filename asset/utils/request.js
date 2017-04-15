import axios from 'axios';
import localEvent from '../stores/localStorage';
const baseURL = `http://192.168.2.222`;
const api = `http://192.168.2.222/api/v1`;
// const baseURL = `http://192.168.2.52`;
// const api = `http://192.168.2.52/api/v1`;
// const baseURL = `http://192.168.199.235`;
// const api = `http://192.168.199.235/api/v1`;
// const baseURL = 'http://thinksns-plus';
// const api = 'http://thinksns-plus/api/v1';

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