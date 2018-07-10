# 开发者手册

## 版本发布

### 版本迭代

每次有更新需要推送到客户时，在根目录下执行 `npm version [patch|minor|major|prerelease]` 等（ version 更迭不支持 yarn 命令），有关 npm version，[参考这里](https://docs.npmjs.com/cli/version)

例如，即将从 `v4.0.0-rc.6` 更新到 `v4.0.0-rc.7`，这是一个 prerelease 版本迭代，则执行 `npm version prerelease` 后 push 到远端即可，该命令会自动 release tag 并推进客户端版本号。

本项目与 npm 版本号迭代规则略有不同，基本遵循以下特点

- 有问题修复，UI变更，功能优化，文案变更等内容，则发布 patch 版本
- 有新功能点、接口变更等，则发布 minor 版本
- 全面迭代，则发布 major 版本
- major 版本迭代后宣布稳定前，则发布 prerelease 版本

### commit message 规范

为了高效率生成 CHANGELOG (版本更新内容一览)，则 commit message 需要根据一定规范进行编写。

本项目使用 angular 规范 (可以参考阮一峰的 [Commit message 和 Change log 编写指南](http://www.ruanyifeng.com/blog/2016/01/commit_message_change_log.html))

每次执行 `npm version **` 时会自动生成截至上一版发布期间的所有 feature、fix、break change 内容。

## 钩子

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

## 组件

### 图片上传组件 ImagePoster

`@/components/ImagePoster.vue`

用于各页面中图片上传相关内容，使用方法详见 `@/pages/profile/Certificate.vue`

#### `Slot`

含有一个匿名 slot，支持任何 html 标签，显示在上传组件的 icon 下方

#### `Event`

##### `uploaded`

图片上传成功后的回调方法，接受一个参数，值为已上传的图片信息。

##### `error`

图片上传失败的回调方法
