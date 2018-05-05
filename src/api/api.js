import axios from "axios";
import Message from "@/plugins/message-box";
import lstore from "@/plugins/lstore/lstore.js";

let cancel;
let pending = {};
const CancelToken = axios.CancelToken;
export const limit = ~~(lstore.getData("BOOTSTRAPPERS") || {}).limit || 15;
const baseURL =
  process.env.NODE_ENV === "production"
    ? `${process.env.VUE_APP_API_HOST}/api/${process.env.VUE_APP_API_VERSION}`
    : "/api/v2";
const instance = axios.create({
  baseURL,
  headers: {
    "X-Requested-With": "XMLHttpRequest"
  }
});

//请求拦截器
instance.interceptors.request.use(
  config => {
    //发起请求时，取消掉当前正在进行的相同请求
    if (pending[config.url]) {
      pending[config.url]("操作取消");
      pending[config.url] = cancel;
    } else {
      pending[config.url] = cancel;
    }
    const TOKEN = (lstore.getData("CURRENTUSER") || {}).token;
    if (TOKEN) {
      config.headers.Authorization = `Bearer ${TOKEN}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

//响应拦截器即异常处理
instance.interceptors.response.use(
  response => {
    return response;
  },
  err => {
    if (err && err.response) {
      switch (err.response.status) {
        case 400:
          err.message = "错误请求";
          break;
        case 401:
          err.message = "未授权，请重新登录";
          break;
        case 403:
          err.message = "拒绝访问";
          break;
        case 404:
          err.message = "请求错误,未找到该资源";
          break;
        case 405:
          err.message = "请求方法未允许";
          break;
        case 408:
          err.message = "请求超时";
          break;
        case 500:
          err.message = "服务器端出错";
          break;
        case 501:
          err.message = "网络未实现";
          break;
        case 502:
          err.message = "网络错误";
          break;
        case 503:
          err.message = "服务不可用";
          break;
        case 504:
          err.message = "网络超时";
          break;
        case 505:
          err.message = "http版本不支持该请求";
          break;
        default:
          err.message = `连接错误${err.response.status}`;
      }
    } else {
      err.message = "发生了一些错误";
    }
    axios.isCancel(err) || Message.error(err.message);
    return Promise.reject(err);
  }
);
export const get = (url, param) => {
  return new Promise((resolve, reject) => {
    instance({
      method: "get",
      url,
      params: param,
      cancelToken: new CancelToken(c => {
        cancel = c;
      })
    }).then(
      res => {
        resolve(res);
      },
      err => {
        reject(err);
      }
    );
  });
};
export const post = (url, param) => {
  return new Promise((resolve, reject) => {
    instance({
      method: "post",
      url,
      data: param,
      cancelToken: new CancelToken(c => {
        cancel = c;
      })
    }).then(
      res => {
        resolve(res);
      },
      err => {
        reject(err);
      }
    );
  });
};

export default instance;
