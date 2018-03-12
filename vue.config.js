console.log(require('./theme'));

module.exports = {
  baseUrl: process.env.BASE_URL || "/",
  lintOnSave: true,
  compiler: false,
  css: {
    sourceMap: !!eval(process.env.GENERATE_CSS_MAP),
    loaderOptions: {
      less: {
        globalVars: require('./theme')
      }
    }
  },
  devServer: {
    open: false,
    proxy: {
      "/api": {
        target: process.env.VUE_APP_API_HOST,
        changeOrigin: true
      }
    }
  }
};
