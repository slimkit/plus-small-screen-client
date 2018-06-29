import api, { limit } from "./api.js";
import router from "@/routers";
/**
 * 获取 首页动态列表
 * @author jsonleex <jsonlseex@163.com>
 * @param  {String} type
 * @param  {Number} limit
 * @param  {Number} after
 * @return {Promise -> Array}
 */

export function getFeedsByType(type, limit = 15, after) {
  const res = { ad: [], feeds: [], pinned: [] };
  const baseUrl = `/feeds?type=${type}&limit=${limit}`;
  const url =
    after > 0
      ? type === "hot"
        ? baseUrl + `&offset=${after}`
        : baseUrl + `&after=${after}`
      : baseUrl;
  return api.get(url).then(
    ({ data = res }) => {
      return data;
    },
    err => {
      if (err.response.status === 401) {
        router.push({
          path: "/signin",
          query: { redirect: router.currentRoute.fullPath }
        });
      }
      return res;
    }
  );
}

/**
 * 申请动态置顶
 * @author mutoe <mutoe@foxmail.com>
 * @export
 * @param {Number} feedId
 * @param {Object} params
 * @returns {Promise}
 */
export function applyTopFeed(feedId, params) {
  return api.post(`/feeds/${feedId}/currency-pinneds`, params, {
    validateStatus: s => s === 201
  });
}

/**
 * 删除动态
 * @author mutoe <mutoe@foxmail.com>
 * @export
 * @param {Number} feedId
 * @returns {Promise}
 */
export function deleteFeed(feedId) {
  return api.delete(`/feeds/${feedId}`, { validateStatus: s => s === 204 });
}

/**
 * 获取当前用户收藏的动态
 * @type {Number}
 */
export function getCollectedFeed({ limit = 15, offset = 0 }) {
  return api.get("/feeds/collections", {
    limit,
    offset
  });
}

// 获取单条动态的评论
export function getFeedComments({ feedId, after = 0 }) {
  return api.get(`/feeds/${feedId}/comments`, {
    limit,
    after
  });
}

export function getFeedCommentPinneds(after = 0) {
  return api.get("/user/feed-comment-pinneds", {
    limit,
    after
  });
}

/**
 * 删除动态评论
 * @author mutoe <mutoe@foxmail.com>
 * @export
 * @param {Number} feedId
 * @param {Number} commentId
 * @returns {Promise}
 */
export function deleteFeedComment(feedId, commentId) {
  return api.delete(`/feeds/${feedId}/comments/${commentId}`, {
    validateStatus: s => s === 204
  });
}
