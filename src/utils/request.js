import axios from 'axios';
import { app } from '../index';
import storeLocal from 'store';

const { apiv1, api, url: baseURL } = window.TS_WEB;

// Export a method to create the requested address.
export const createRequestURI = PATH => `${baseURL}/${PATH}`;

// Created the request address of API.
export const createAPI = PATH => `${api}/${PATH}`;

// Created the request address of API V1.
export const createOldAPI = PATH => `${apiv1}/${PATH}`;

// 注入access-token验证
export const addAccessToken = () => {
    // 如果有才发送
    const { token = '' } = storeLocal.get('UserLoginInfo') || {};

    let _token = token ? `Bearer ${token}` : '';

    axios.defaults.headers.common = {
        'Authorization': _token,
        'Accept': 'application/json'
    };
    return axios;
};

axios.interceptors.response.use(
    function(response) {
        return response;
    },
    // 错误请求处理
    function(error) {

        if(error.response) {
            const { status } = error.response;
            // token失效 提示: 重新登录
            if(status === 401) {
                // 清除本地保存的 token
                app.$store.dispatch('LOGOUT');
                storeLocal.remove('UserLoginInfo');
                app.$router.push({ path: '/login', query: { redirect: app.$route.fullPath } });
                return Promise.reject({ response: { data: { message: "登录失效, 请重新登录" } } });
            }
        } else if(error.request) {
            console.log(error.request);
        } else {
            console.log('Error', error.message);
        }

        return Promise.reject(error);
    }
);

export default axios;