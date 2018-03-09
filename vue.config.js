/**
 * Get The Plus API "/api/*" proxy.
 *
 * @return {Object}
 * @author Seven Du <shiweidu@outlook.com>
 */
function getPlusApiProxy() {
  if (!process.env.API_PROXY_TARGET) {
    return {};
  }

  return {
    "/api": {
      target: process.env.API_PROXY_TARGET,
      changeOrigin: true
    }
  };
}

module.exports = {
  baseUrl: process.env.BASE_URL || "/",
  lintOnSave: true,
  compiler: false,
  css: {
    sourceMap: !!eval(process.env.GENERATE_CSS_MAP),
    loaderOptions: {
      less: {
        globalVars: require("./theme")
      }
    }
  },
  devServer: {
    proxy: {
      "/api": {
        target: process.env.VUE_APP_API_HOST,
        changeOrigin: true
      }
    }
  }
};
