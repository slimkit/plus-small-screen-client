import { get } from "./api.js";

/**
 * 获取当前用户收藏的动态
 * @type {Number}
 */
export function getCollectedFeed({ limit = 15, offset = 0 }) {
  return get("/feeds/collections", {
    limit,
    offset
  });
}
