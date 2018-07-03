module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    "plugin:vue/recommended",
    "@vue/prettier"
  ],
  rules: {
    "no-console": ["warn" , { allow: ["warn", "error", "info"] }],
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off"
  },
  parserOptions: {
    parser: "babel-eslint"
  }
};
