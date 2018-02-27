/* eslint no-var: 0, vars-on-top: 0 */
process.env.NODE_ENV = 'production';
require('babel-register');
require('./webpack/build');
