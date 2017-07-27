import axios from 'axios';
import localEvent from '../stores/localStorage';
import errorCodes from '../stores/errorCodes';
import {
  NOTICE,
  SHOWPOST,
  SHOWFEEDDIGGSLISTS
} from '../stores/types';

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
  } = localEvent.getLocalItem('UserLoginInfo');
  let _token = '';
  if (token) {
    _token = `Bearer ${token}`;
  }
  axios.defaults.headers.common = {
    'Authorization': _token,
    'ACCESS-TOKEN': token,
    'Accept': 'application/json'
  };
  return axios;
};

axios.interceptors.response.use(
  function(response) {
    //对响应数据做些事
    return response;
  }
);

export default axios;