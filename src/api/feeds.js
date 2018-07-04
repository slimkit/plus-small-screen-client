import api, { limit } from "./api.js";

/**
 * 获取 首页动态列表
 * @author jsonleex <jsonlseex@163.com>
 * @param  {string} type
 * @param  {number} limit
 * @param  {number} after
 * @returns {Promise<Array>}
 */
export function getFeedsByType(type, limit = 15, after) {
  const baseUrl = `/feeds?type=${type}&limit=${limit}`;
  const url =
    after > 0
      ? type === "hot"
        ? baseUrl + `&offset=${after}`
        : baseUrl + `&after=${after}`
      : baseUrl;
  return api.get(url);
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
 * @description
 * @author mutoe <mutoe@foxmail.com>
 * @export
 * @param {number} feedId
 * @param {Object} params
 * @param {number} [params.limit] limit
 * @param {number} [params.offset] offset
 * @param {string} [params.order] asc 正序 desc 倒序
 * @param {string} [params.oforder_type] date 按时间 amount 按金额
 * @returns
 */
export function getRewards(feedId, params) {
  const url = `/feeds/${feedId}/rewards`;
  return api.get(url, { params, validateStatus: s => s === 200 });
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
 * @param {number} feedId
 * @returns {Promise}
 */
export function deleteFeed(feedId) {
  return api.delete(`/feeds/${feedId}`, { validateStatus: s => s === 204 });
}

/**
 * 获取当前用户收藏的动态
 * @type {number}
 */
export function getCollectedFeed({ limit = 15, offset = 0 }) {
  return api.get("/feeds/collections", {
    limit,
    offset
  });
}

/**
 * 获取单条动态的评论
 * @author mutoe <mutoe@foxmail.com>
 * @export
 * @param {number} feedId
 * @param {Object} params
 * @param {number} params.limit
 * @param {number} params.after
 * @returns
 */
export function getFeedComments(feedId, params) {
  const { limit, after = 0 } = params;
  return api.get(`/feeds/${feedId}/comments`, {
    params: { limit, after },
    validateStatus: s => s === 200
  });
}

/**
 * 获取置顶评论
 * @export
 * @param {number} [after=0]
 * @returns
 */
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
 * @param {number} feedId
 * @param {Object} data
 * @param {string} data.body 评论内容
 * @param {Number} [data.reply_user] 回复的用户id
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
 * @param {number} payload.feedId
 * @param {number} payload.commentId
 * @param {Object} data post入参
 * @param {number} data.amount 置顶总价
 * @param {number} data.day 置顶天数
 * @returns
 */
export function applyTopFeedComment({ feedId, commentId }, data) {
  const url = `/feeds/${feedId}/comments/${commentId}/currency-pinneds`;
  return api.post(url, data, { validateStatus: s => s === 201 });
}

/**
 * 删除动态评论
 * @author mutoe <mutoe@foxmail.com>
 * @export
 * @param {number} feedId
 * @param {number} commentId
 * @returns
 */
export function deleteFeedComment(feedId, commentId) {
  return api.delete(`/feeds/${feedId}/comments/${commentId}`, {
    validateStatus: s => s === 204
  });
}
