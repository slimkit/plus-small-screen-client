# 开发者手册

## 全局钩子

全局钩子挂载于 `./src/bus.js` 下的事件总线上。

### 打赏 (reward)

呼出打赏窗口

#### 调用方法
以打赏动态为例
``` js
import bus from "@/bus";
// ...
const api = axios.post(url, payload, {validateStatus});
const cb = amount => { console.log(amount); }
/**
 * 弹出打赏窗口 (hooks -> reward)
 * @author mutoe <mutoe@foxmail.com>
 * @param {Object} options
 * @param {string} options.type 打赏的类型
 * @param {AxiosPromise} options.api 打赏的 api，接受 axios promise 对象
 * @param {string|Object} options.payload api 的第一个参数，取决于 api
 * @param {requestCallback} [options.callback = noop] 打赏成功后的回调方法, 接受一个参数 amount 打赏金额
 */
bus.$emit("reward", {
  type: "feed",
  api,
  payload: { feedID },
  callback：cb
});
```

### 申请置顶

#### 调用方法
``` js
import bus from "@/bus";
// ...
const api = axios.post(url, payload, {validateStatus});
const cb = () => { console.log("success"); }
/**
 * 弹出申请置顶窗口 (hooks -> applyTop)
 * @author mutoe <mutoe@foxmail.com>
 * @param {Object} options
 * @param {string} options.type 申请置顶类型
 * @param {AxiosPromise} options.api 申请置顶的 api，需要返回 axios promise 对象
 * @param {string|Object} options.payload 申请置顶 api 的第一个参数，取决于 api 中的设定
 * @param {boolean} [options.isOwner = false] 是否是文章的所有者, 文章的所有者申请置顶时文案略有不同
 * @param {requestCallback} [options.callback = noop] 申请置顶成功后执行的回调方法
 */
bus.$emit("applyTop", {
  type: "",
  api,
  payload: { feedID },
  isOwner: true,
  callback: cb
})
```
