import vuex from "@/stores";
import api, { get } from "./api.js";

const resArray = { data: [] };

/**
 * 关注/取关
 * @author jsonleex <jsonlseex@163.com>
 * @param  {String} options.status  ["unFollow", "eachFollow", "follow"]
 * @param  {Number} options.id      user.id
 * @return {Promise -> Object}
 */
export const followUserByStatus = ({ status, id }) => {
  let method;
  switch (status) {
    case "unFollow":
      method = "PUT";
      break;
    case "eachFollow":
      method = "DELETE";
      break;
    case "follow":
      method = "DELETE";
      break;
  }
  if (!method || !id) throw new Error("参数错误");
  let url = `/user/followings/${id}`;
  const res = {
    status: true,
    follower: method === "PUT"
  };

  return api({
    method,
    url,
    validateStatus: s => s === 204
  }).then(() => {
    vuex.commit("SAVE_USER", { id, follower: res.follower });
    return res.follower;
  });
};

/**
 * 搜索用户
 * @author jsonleex <jsonlseex@163.com>
 * @param  {String} key
 * @param  {Number} after 偏移量 用于翻页
 * @return {Promise -> Array}
 */
export function searchUserByKey(key, after) {
  const url =
    after > 0
      ? `/user/search?keyword=${key}&offset=${after}`
      : `/user/search?keyword=${key}`;
  return key
    ? get(url).catch(() => {
        return resArray;
      })
    : Promise.resolve(resArray);
}

/**
 * 找人
 * @author jsonleex <jsonlseex@163.com>
 * @param  {String} type
 * @param  {Object} config
 * @return {Promise -> Array}
 */
export const findUserByType = (type, param) => {
  const typeMap = ["recommends", "populars", "latests", "find-by-tags"];
  if (!typeMap.includes(type)) {
    return Promise.reject(new Error("参数不正确"));
  }
  return get(`/user/${type}`, param).catch(() => {
    // 错误处理
    return resArray;
  });
};
