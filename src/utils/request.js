import axios from 'axios';
import localEvent from '../stores/localStorage';
import { app } from '../index';
import errorCodes from '../stores/errorCodes';
import { NOTICE, SHOWPOST, SHOWFEEDDIGGSLISTS } from '../stores/types';

const { api, url: baseURL } = window.TS_WEB;
// 需要传递promise到应用层的错误代码
const promiseCode = [1000, 1001, 1002, 1003, 1004, 1005, 1006, 1007, 1008, 1009, 1010, 1011];
// 用户验证直接截断处理
const cutDownCode = 1099;

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
    if( errorResponse.data.code !== cutDownCode && promiseCode.indexOf(errorResponse.data.code) !== -1 ) {
      
    } 
    if (errorResponse.data.code === cutDownCode) {
      let notice = {
        show: true,
        time: 1500,
        status: false,
        text: '登录信息失效，请重新登录'
      }
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
      app.$store.dispatch(NOTICE, cb => {
        cb(notice);
      });
      setTimeout( () => {
        app.$router.push({ path: '/login', query: { redirect: redirect } });
      }, 1500);
    } else if( promiseCode.indexOf(errorResponse.data.code) !== -1) {
      return Promise.reject(error);
    } else {
      let notice = {
        show: true,
        time: 1500,
        status: false,
        text: errorCodes[errorResponse.data.code]
      }
      app.$store.dispatch(NOTICE, cb => {
        cb(notice);
      });
      return false;
    }
  }
);

export default axios;