# ThinkSNS+ HTML 5 (SPA)😊

The package is a SPA for ThinkSNS+

## Stack

- ES 6
- webpack
- SASS
- LESS
- Vue
- vuex
- vue-router
- PHP 7
- Composer
- Yarn | NPM
- Node

## Install

```shell
composer require zhiyicx/plus-component-web
```

##### Dependencies ThinkSNS+ library:

- zhiyicx/plus-component-im
- zhiyicx/plus-component-feed

#### Publish font-end application （SPA）

```shell
php artisan package:handle h5 publish
```

## Remove

```shell
composer remove zhiyicx/plus-component-web
```

> Because h5 rely on the ThinkSNS+ other packages, so when the installation of h5 these packages will be installed together, you have not installed these packages alone, then remove the h5 when these dependent packages will be removed together.

## Develop

 - Node 6+
 - PHP
 - Yarn
 - Composer
 - ThinkSNS+

Commands:

- yarn clean-dist
- yarn dev
- yarn hot
- yarn watch
- yarn dist

### Link asstes

```shell
php artisan package:handle h5 link
```
