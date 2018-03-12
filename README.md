# ThinkSNS+ HTML 5 (SPA)😊

这是 ThinkSNS Plus 的一个 SPA 前端应用！

> 当前分支为 `4.0.0-rc.*` 版本开发分支，安装**稳定版本**请前往👉[3.x Branch](https://github.com/zhiyicx/plus-component-h5/tree/3.x)

## 概述

> 是的！4.0 是一个全新的版本，并且是和以往版本完全不同的版本。

安装 `4.0` 版本你唯一的前置条件是已经安装了 Plus 程序！然后，4.0 版本是完全静态，可分发，独立部署的手机浏览器客户端。
因为 4.0 版本已经不再依赖服务器，而是通过 API 的方式进行交互。

## 下载

首先，你可以通过多种途径下载 SPA：

Composer:

```shell
composer create-project zhiyicx/plus-component-h5:4.0.0-rc.*
```

Git:

```shell
git clone https://github.com/zhiyicx/plus-component-h5
```

## 安装

通过上述任一方式下载完成后，我们进入 SPA 的目录，你会看到一个 `.env.example` 的文件，你需要复制一份，并命名为 `.env`：

| 健 | 描述 |
|-----|-----|
| BASE_URL | 项目部署的基础路径，我们默认假设你的应用将会部署在域名的根部，比如 `https://www.my-app.com/` 如果你的应用时部署在一个子路径下，那么你需要在这里指定子路径。比如，如果你的应用部署在 `https://www.foobar.com/my-app/` 那么将这个值改为 `/my-app/` |
| GENERATE_CSS_MAP | 编译静态资源的时候是否生成 `sourceMap` |
| VUE_APP_API_HOST | 你的 Plus 程序网址 |
| VUE_APP_API_VERSION | 你要使用的 Plus 程序 API 版本号，目前固定为 `v2` |
| VUE_APP_NAME | 你的程序名字 |
| VUE_APP_KEYWORDS | 你的程序关键词，使用英文半角 `,` 符号分割多 |
| VUE_APP_DESCRIPTION | 你的程序描述 |
| VUE_APP_ROUTER_MODE | 前端路由使用的路由模式，支持 `hash` 和 `history` 两种模式，具体请参考👉 [`vue-route mode`](https://router.vuejs.org/zh-cn/api/options.html#mode) |

> 以上信息配置完成后，你运行 **`yarn`** 或者 **`npm install`** 进行依赖安装！

## 本地运行

好了，你已经安装完成了，首先我们本地预览一下吧，在 SPA 目录执行 `yarn serve` 或者 `npm run serve` 你的浏览器会自动打开预览地址！
你现在可以看到程序的样子了。

## 正式部署

现在，我们开始部署吧，你只需要运行 `yarn build` 或者 `npm run build` 然后等待命令执行完成后，你会看到多出一个 `/dist` 目录。

现在我们吧 `/dist` 目录的内容放置在的的 http 服务器上，而且并不需要任何的动态语言支持。就是纯静态，所以你也可以放置在 CDN 上进行分发。

### 使用 `history` 模式

如果你要使用 `history` 模式，需要你的服务器的转发支持，所以请参看👉[HTML5 History 模式](https://router.vuejs.org/zh-cn/essentials/history-mode.html) 文档。

### 跨域问题

当你部署 SPA 后，如果放置程序的域也就是 `VUE_APP_API_HOST` 配置的是其他域名，你的 Plus 需要配置跨域选项。

现在，你进入 Plus 程序，打开 `.plus.yml` 文件，添加如下内容：

```
http:
    cors:
        credentials: true
        origin:
            - http://my-app.com
```

> 因为 origin 是可以配置多个运行跨域的域名的，你将 `http://my-app.com` 替换为 SPA 的地址即可。

当然，你可以将 `origin` 直接设置为 `*` 来运行所有的跨域请求。
