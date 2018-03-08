import api from "./api";

/**
 * 动态相关
 */
// 获取动态
export const getFeeds = params => {
  return api("/feeds", params);
};

/**
 * 用户相关
 */

// 登录
export const signin = params => {
  return api("/tokens", params, "POST");
};
