module.exports = {
  baseUrl: process.env.BASE_URL || "/",
  lintOnSave: true,
  // compiler: false,
  css: {
    sourceMap: !!eval(process.env.GENERATE_CSS_MAP),
    loaderOptions: {
      less: {
        globalVars: require("./theme")
      }
    }
  },
  configureWebpack: {
    output: {
      chunkFilename: "js/[name].js"
    }
  },
  chainWebpack: config => {
    config.plugin("html").tap(args => {
      args[0].chunksSortMode = "none";
      return args;
    });
  },
  devServer: {
    open: false,
    disableHostCheck: true,
    proxy: {
      "/api": {
        target: process.env.VUE_APP_API_HOST,
        changeOrigin: true
      }
    }
  }
};
