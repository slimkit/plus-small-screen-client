import path from 'path';
import dotenv from 'dotenv';

dotenv.config({
  path: path.resolve(process.cwd(), '.env')
});

if (!process.env.API_PROXY_HOST) {
  throw new Error('Cannot read "API_PROXY_HOST" from environment variable.');
}

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
        target: process.env.API_PROXY_HOST,
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/api'
        }
      }
    },
    cssSourceMap: false
  }
}
