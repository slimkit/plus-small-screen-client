// import opn from 'opn';
import path from 'path';
import webpack from 'webpack';
import express from 'express';
import config from './config/';
import devConfig from './dev.conf';
import proConfig from './pro.conf';
import portfinder from 'portfinder';
import hotMiddleware from 'webpack-hot-middleware';
import devMiddleware from 'webpack-dev-middleware';
import proxyMiddleware from 'http-proxy-middleware';

if(!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV);
}

const webpackConfig = (process.env.NODE_ENV === 'production') ?
  proConfig :
  devConfig;
// port
const port = process.env.PORT || config.dev.port;
// proxyTable
const proxyTable = config.dev.proxyTable;

const app = express();
const compiler = webpack(webpackConfig);

app.use(hotMiddleware(compiler, {
  log: false,
  heartbeat: 2000
}));

// proxy api requests
Object.keys(proxyTable).forEach(function(context) {
  let options = proxyTable[context];
  if(typeof options === 'string') {
    options = { target: options };
  }
  app.use(proxyMiddleware(options.filter || context, options));
});

const DMEInstance = devMiddleware(compiler, {
  publicPath: webpackConfig.output.publicPath,
  logLevel: 'error'
});

app.use(DMEInstance);

// serve pure static assets
const staticPath = path.posix.join(config.dev.assetsPublicPath);
app.use(staticPath, express.static('./static'));

let _resolve, _reject;
const readyPromise = new Promise((resolve, reject) => {
  _resolve = resolve;
  _reject = reject;
});

let server;
portfinder.basePort = port;

console.log('> Starting dev server...');
DMEInstance.waitUntilValid(() => {
  portfinder.getPort((err, port) => {
    if(err) {
      _reject(err);
    }
    process.env.PORT = port;
    const uri = 'http://localhost:' + port;
    console.log('> Listening at ' + uri + '\n');

    server = app.listen(port);
    _resolve();
  });
});

export default {
  ready: readyPromise,
  close: () => {
    server.close();
  }
};