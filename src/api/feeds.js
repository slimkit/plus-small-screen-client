import api, { get, limit } from "./api.js";

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
  const url = after > 0 ? baseUrl + `&after=${after}` : baseUrl;
  return api.get(url).then(
    ({ data = res }) => {
      return data;
    },
    err => {
      console.log(err);
      return res;
    }
  );
}

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

// 获取单条动态的评论
export function getFeedComments({ feedId, after = 0 }) {
  return get(`/feeds/${feedId}/comments`, {
    limit,
    after
  });
}

export function getFeedCommentPinneds(after = 0) {
  return get("/user/feed-comment-pinneds", {
    limit,
    after
  });
}
