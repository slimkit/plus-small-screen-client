import axios from 'axios';
import { app } from '../index';
import storeLocal from 'store';
import { NOTICE, SHOWPOST, SHOWFEEDDIGGSLISTS } from '../stores/types';

// 消息处理
import PlusMessageBundle from '../utils/es';

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
        // 对响应数据做些事
        return response;
    },
    // 错误请求处理
    function(error) {

        if(error.response) {
            const { status, data = {} } = error.response;
            const message = PlusMessageBundle(data).getMessage();

            // token失效 提示: 重新登录
            if(status === 401) {
                // 清除本地保存的 token
                storeLocal.remove('UserLoginInfo');

                app.$store.dispatch(NOTICE, cb => {
                    cb({
                        show: true,
                        time: 1500,
                        status: false,
                        text: "登录失效，请重新登录！"
                    });
                });

                setTimeout(() => {
                    app.$router.push('/login');
                }, 1500);

                return false;
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