import axios from "axios";
import localEvent from "store";
import router from "./routers/";
import Message from "@/plugins/message";
import { plusMessageAnalyze } from "@/filters";
/**
 * 添加请求拦截器
 *     @author jsonleex <jsonlseex@163.com>
 */
let TOKEN;
axios.interceptors.request.use(
  config => {
    TOKEN = (localEvent.get("CURRENTUSER") || {}).token;
    if (TOKEN) {
      config.headers.Authorization = `Bearer ${TOKEN}`;
    }
    return config;
  },
  error => {
    console.error("错误的传参", "fail");
    return Promise.reject(error);
  }
);

/**
 * 添加响应拦截器
 *     @author jsonleex <jsonlseex@163.com>
 */
axios.interceptors.response.use(
  res => res,
  /* 错误处理 */
  error => {
    const callback = () => {
      router.push({
        path: "/signin",
        query: { redirect: router.currentRoute.fullPath }
      });
    };
    const setTimeoutCallback = () => {
      setTimeout(callback, 500);
    };
    if (error.response) {
      const { status, data } = error.response;
      switch (status) {
        case 401:
          localEvent.remove("CURRENTUSER");
          setTimeoutCallback();
          Message.error(TOKEN ? "登录失效, 请重新登录" : "您还没有登录");
          break;
        default:
          Message.error(plusMessageAnalyze(data));
          break;
      }
    } else if (error.request) {
      console.log(error.request);
    } else {
      console.log("Error", error.message);
    }

    return Promise.reject(error);
  }
);

/* 获取配置的 api */
const basename = document.head.querySelector('meta[name="api-basename"]');
if (!basename) {
  console.error(
    '未配置api接口，请设置 "<meta name="api-basename" content="url">"'
  );
}

// 默认 v2 接口
axios.defaults.baseURL = basename ? basename.content : "/api/v2";

export default axios;
