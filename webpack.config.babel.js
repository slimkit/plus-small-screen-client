var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = ('extract-text-webpack-plugin');
// import autoprefixer from 'autoprefixer';
// import { StatsWriterPlugin } from 'webpack-stats-plugin';
// import lodash from 'lodash';
// import fs from 'fs';

// 环境变量获取
const NODE_ENV = process.env.NODE_ENV || 'development';
const isHot = process.argv.includes('--hot');

// 是否是正式环境编译
const isProd = NODE_ENV === 'production';

// 各项资源地址定义
const assetsRoot = path.join(__dirname, 'asset');
const buildAssetsRoot = path.resolve(__dirname, 'dist/');

// 入口配置
const entry = {
  user: path.join(assetsRoot, 'index.js')
};

const webpackConfig = {
  entry,
  output: {
    path: path.join(buildAssetsRoot),
    // filename: isProd ? 'js/[name].[chunkhash].js' : 'js/[name].js',
    filename: 'js/[name].js'
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    modules: [
      assetsRoot,
      path.join(__dirname, 'node_modules')
    ],
    alias: {
      'jquery': `jquery/dist/jquery.${isProd ? 'min.js' : 'js'}`,
      'vue$': 'vue/dist/vue.common.js'
    }
  },
  module: {
    rules: [
      // {
      //   test: /\.(js|vue)$/,
      //   loader: 'eslint-loader',
      //   enforce: "pre",
      //   include: [
      //     assetsRoot,
      //   ]
      // },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            scss: 'vue-style-loader!css-loader!sass-loader', // <style lang="scss">
          }
        }
      },
      {
        test: /\.(scss|css)$/,
        loader: 'style-loader!css-loader!postcss-loader!sass-loader',
        query: {
          name: 'css/[name].css'
        }
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: isProd ? 'images/[name].[ext]' : `images/[name].[ext]`
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: isProd ? 'fonts/[name].[ext]' : `fonts/[name].[ext]`
        }
      }
    ]
  }
  ,
  plugins: [
    // extract css into its own file
    new ExtractTextPlugin({
      filename: isProd ? 'css/[name].css' : 'css/[name].css'
    })
  ]
};

// export default webpackConfig;
