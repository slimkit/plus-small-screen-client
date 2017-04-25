import axios from 'axios';
import localEvent from '../stores/localStorage';
import { app } from '../index';
import errorCodes from '../stores/errorCodes';
import { NOTICE, SHOWPOST, SHOWFEEDDIGGSLISTS } from '../stores/types';

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

axios.interceptors.response.use(
  function (response) {
   //对响应数据做些事
   return response;
 },
 function (error) {
   //请求时发生用户认证失败的情况，直接跳转到登录页
   let errorResponse = error.response;
   let notice = {
      show: true,
      time: 1500,
      status: false,
      text: '登录信息失效，请重新登录'
    }
   if(errorResponse.data.code !== 1099) {
    notice = {
      show: true,
      time: 1500,
      status: false,
      text: errorCodes[errorResponse.data.code]
    }
   }
   app.$store.dispatch(NOTICE, cb => {
      cb(notice);
    });
    // 关闭发布弹出层
    app.$store.dispatch(SHOWPOST, cb => {
      cb({
        show: false
      });
    });
    app.$store.dispatch(SHOWFEEDDIGGSLISTS, cb => {
      cb({
        show: false,
        diggs: {}
      });
    });
    // 跳转登录
    let redirect = app.$route.path;
    localEvent.setLocalItem('UserLoginInfo', {});
    if(errorResponse.data.code === 1099) {
      setTimeout( () => {
        app.$router.push({ path: '/login', query: { redirect: redirect } });
      }, 1500);
    } else {
      return Promise.reject(error);
    }
 }
);

export default axios;