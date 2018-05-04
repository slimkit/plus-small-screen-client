import { get } from "./api.js";
const uri = "/user/news/contributes";
/**
 * 获取当前用户投稿列表
 * @Author   Wayne
 * @DateTime 2018-04-28
 * @Email    qiaobin@zhiyicx.com
 * @param    {Number}   type [类型: 0: 已发布, 1: 待审核, 2: 已驳回]
 * @return   [Promise]
 */
export function getMyNews({ type = 0, limit = 15, after = 0 }) {
  return get(uri, {
    type,
    limit,
    after
  });
}

/**
 * 搜索资讯
 * @author jsonleex <jsonlseex@163.com>
 * @param  {String} key
 * @param  {Number} limit
 * @param  {Number} after
 * @return {Promise -> Array}
 */
export function searchNewsByKey(key = "", limit = 15, after = 0) {
  return !key
    ? Promise.resolve([])
    : get(`/news?key=${key}&limit=${limit}&after=${after}`).then(
        ({ data = [] }) => {
          return data;
        },
        err => {
          console.log(err);
          return [];
        }
      );
}
