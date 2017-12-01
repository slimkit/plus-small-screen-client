import axios from 'axios';
import localEvent from 'store';
import router from './routers/';
/**
 * 添加请求拦截器
 *     @author jsonleex <jsonlseex@163.com>
 */
axios.interceptors.request.use(config => {

    // if(config.method === 'post') {
    //     // JSON 转换为 FormData
    //     const formData = new FormData()
    //     Object.keys(config.data).forEach(key => formData.append(key, config.data[key]))
    //     config.data = formData
    // }

    if((localEvent.get('CURRENTUSER') || {}).token) {
        config.headers.Authorization = `Bearer ${localStorage.token}`
    }
    return config
}, error => {
    console.error("错误的传参", 'fail');
    return Promise.reject(error);
});

/**
 * 添加响应拦截器
 *     @author jsonleex <jsonlseex@163.com>
 */
axios.interceptors.response.use(res => {
        return res;
    },
    /* 错误处理 */
    error => {
        if(error.response) {
            const { status } = error.response;
            if(status === 401) {
                router.push({ path: '/signin', query: { redirect: router.currentRoute.fullPath } });
                return Promise.reject({
                    response: { data: { message: "登录失效, 请重新登录" } }
                });
            }
        } else if(error.request) {
            console.log(error.request);
        } else {
            console.log('Error', error.message);
        }

        return Promise.reject(error);
    }
);

/* 获取配置的 api */
const basename = document.head.querySelector('meta[name="api-basename"]');
if(!basename) {
    console.error('未配置api接口，请设置 "<meta name="api-basename" content="url">"');
}

// 默认 v2 接口
axios.defaults.baseURL = basename.content || '/api/v2';

export default {
    install(vue, opt = {}) {
        Object.defineProperty(vue.prototype, '$http', { value: axios });
    }
};