import vuex from "@/stores";
import api, { get } from "./api.js";

const userState = vuex.state.USERS;

const resArray = { data: [] };

/**
 * 关注 || 取关 操作
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

/**
 * 查找附近的人
 * @author jsonleex <jsonlseex@163.com>
 * @param  {Number} options.lng: longitude    经度
 * @param  {Number} options.lat: latitude     纬度
 * @param  {Number} page                      当前页
 * @return {Promise -> Array}
 */
export const findNearbyUser = ({ lng: longitude, lat: latitude }, page = 0) => {
  const param = {
    limit: 10,
    longitude,
    latitude
  };

  page > 0 && (param.page = page);
  return get("around-amap", param).then(data => data, () => resArray);
};

/**
 * 获取用户基本信息
 *
 * 优先返回本地数据
 *
 * @author jsonleex <jsonlseex@163.com>
 * @param  {Number} id
 * @return {Promise -> Object}
 */
export const getUserInfoById = id => {
  const user = userState[`user_${id}`];
  return new Promise(resolve => {
    user
      ? resolve(user)
      : api
          .get(`/users/${id}`, {
            validateStatus: s => s === 404 || s === 201 || s === 200
          })
          .then(({ data }) => {
            data = data.id ? data : {};
            resolve(data);
          });
  });
};

/**
 * 获取用户粉丝列表
 * @author jsonleex <jsonlseex@163.com>
 * @param  {Number} options.uid
 * @param  {String} options.type
 * @param  {Number} options.offset
 * @return {Promise -> Array}
 */
export function getUserFansByType({ uid, type, offset = 0 }) {
  return get(`/users/${uid}/${type}`, {
    limit: 15,
    offset
  }).catch(err => {
    console.log(err);
    Promise.reject(resArray);
  });
}
