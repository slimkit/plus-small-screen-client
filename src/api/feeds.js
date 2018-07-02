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
 * @param {number} feedId
 * @param {Object} params
 * @returns {Promise}
 */
export function applyTopFeed(feedId, params) {
  return api.post(`/feeds/${feedId}/currency-pinneds`, params, {
    validateStatus: s => s === 201
  });
}

/**
 * 打赏动态
 * @author mutoe <mutoe@foxmail.com>
 * @export
 * @param {number} feedId
 * @param {Object} data
 * @param {number} data.amount 打赏金额
 * @returns
 */
export function rewardFeed(feedId, data) {
  const url = `/feeds/${feedId}/new-rewards`;
  return api.post(url, data, { validateStatus: s => s === 201 });
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
 * 发表动态评论
 * @author mutoe <mutoe@foxmail.com>
 * @export
 * @param {Number} feedId
 * @param {Object} data
 * @param {String} data.body 评论内容
 * @param {Number=} data.reply_user 回复的用户id
 * @returns
 */
export function postComment(feedId, data) {
  return api.post(`/feeds/${feedId}/comments`, data, {
    validataStatus: s => s === 201
  });
}

/**
 * 评论申请置顶
 * @author mutoe <mutoe@foxmail.com>
 * @export
 * @param {Object} payload 第一个参数
 * @param {Number} payload.feedId
 * @param {Number} payload.commentId
 * @param {Object} data post入参
 * @param {Number} data.amount 置顶总价
 * @param {Number} data.day 置顶天数
 * @returns Promise
 */
export function applyTopFeedComment({ feedId, commentId }, data) {
  const url = `/feeds/${feedId}/comments/${commentId}/currency-pinneds`;
  return api.post(url, data, { validateStatus: s => s === 201 });
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
