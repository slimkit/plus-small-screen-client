# ThinkSNS+ HTML 5 (SPA)😊

这是 ThinkSNS Plus 的一个 SPA 前端应用！

## 安装

在 Plus 程序下执行

```shell
composer require zhiyicx/plus-component-h5
```

然后执行 `php artisan vendor:publish --force` 然后页面就会出现一个列表，你找到 `\Zhiyi\Component\ZhiyiPlus\PlusComponentH5\ServiceProvider` 这一条，输入对应编号后按「enter」按键，像现在 你已经安装完成了！！

> 访问 `/h5` 看看吧

## 开发

首先，你需要先准备一个 Plus 程序，而你并不需要把 SPA 安装到 Plus 程序当中！是的，你可以在任意位置开发 SPA。

首先，进入 SPA 程序目录，你需要将 `.env.example` 文件复制一份为 `.env` 文件。文件内容如下：

```env
API_PROXY_HOST=http://localhost:8000
```

那么你需要修改 `API_PROXY_HOST` 的值，修改为你的 Plus 程序地址。

然后你在 SPA 文件夹下执行 `yarn dev` 或者 `npm run dev` 就可以了！！！按照命令行打开地址。
