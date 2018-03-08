/**
 * Get The Plus API "/api/*" proxy.
 *
 * @return {Object}
 * @author Seven Du <shiweidu@outlook.com>
 */
function getPlusApiProxy() {
  if (! process.env.API_PROXY_TARGET) {
    return {};
  }

  return {
    "/api": {
      target: process.env.API_PROXY_TARGET,
      changeOrigin: true
    }
  };
};

module.exports = {
  lintOnSave: true,
  compiler: false,
  css: {
    sourceMap: process.env.GENERATE_CSS_MAP || false,
    loaderOptions: {
      less: {
        globalVars: require('./theme'),
      },
    },
  },
  // 因为垃圾 @vue/cli 3 的 proxy 不能是空，暂时这样写，后期用 Object.assign 进行拼装！！！
  // 垃圾 @vue/cli 3.
  devServer: process.env.API_PROXY_TARGET ? {
    proxy: {
      "/api": {
        target: process.env.API_PROXY_TARGET,
        changeOrigin: true
      }
    },
  } : {},
};
