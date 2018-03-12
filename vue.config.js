const fs = require("fs");
function getLessVariables(file) {
  const themeContent = fs.readFileSync(file, "utf-8");
  const variables = {};
  themeContent.split("\n").forEach(item => {
    if (item.indexOf("//") > -1 || item.indexOf("/*") > -1) {
      return;
    }
    const _pair = item.split(":");
    if (_pair.length < 2) return;
    const key = _pair[0].replace("\r", "").replace("@", "");
    if (!key) return;
    const value = _pair[1]
      .replace(";", "")
      .replace("\r", "")
      .replace(/^\s+|\s+$/g, "");
    variables[key] = value;
  });
  return variables;
}
module.exports = {
  baseUrl: process.env.BASE_URL || "/",
  lintOnSave: true,
  compiler: false,
  css: {
    sourceMap: !!eval(process.env.GENERATE_CSS_MAP),
    loaderOptions: {
      less: {
        globalVars: getLessVariables(process.env.VUE_APP_THEME_PATH)
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
