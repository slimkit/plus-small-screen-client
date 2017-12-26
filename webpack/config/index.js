import path from 'path'
export default {
  build: {
    env: {
      NODE_ENV: '"production"'
    },
    assetsRoot: path.resolve(__dirname, '../../dist'),
    assetsPublicPath: '/assets/h5/',
    productionSourceMap: true
  },

  dev: {
    env: {
      NODE_ENV: '"development"'
    },
    autoOpenBrowser: true,
    port: process.env.PORT || 8080,
    assetsPublicPath: '/',
    proxyTable: {
      // proxy all requests starting with /api to jsonplaceholder
      '/api': {
        target: 'http://test-plus.zhibocloud.cn',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/api'
        }
      }
    },
    cssSourceMap: false
  }
}
