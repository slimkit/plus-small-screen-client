import vuex from "@/stores";
import api from "./api.js";
import $Message from "@/plugins/message-box";
import lstore from "@/plugins/lstore/lstore.js";

/**
 * 定义用户对象
 * @typedef {{id: number, name: string, ...more}} UserObject
 */

const userState = vuex.state.USERS;
const resArray = { data: [] };

/**
 * 关注 || 取关 操作
 * @author jsonleex <jsonlseex@163.com>
 * @export
 * @param  {string} options.status  ["unFollow", "eachFollow", "follow"]
 * @param  {number} options.id      user.id
 * @returns
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
 * @export
 * @param  {string} key
 * @param  {number} after 偏移量 用于翻页
 * @returns {Promise<UserObject[]>}
 */
export function searchUserByKey(key, after) {
  if (!key) return Promise.resolve(resArray);

  const params = { keyword: key };
  after > 0 && (params.offset = after);
  return api
    .get("/user/search", { params })
    .catch(() => Promise.resolve(resArray));
}

/**
 * 找人
 * @author jsonleex <jsonlseex@163.com>
 * @export
 * @param  {string} type
 * @param  {Object} config
 * @returns {Promise<UserObject[]>}
 */
export const findUserByType = (type, params) => {
  const typeMap = ["recommends", "populars", "latests", "find-by-tags"];
  if (!typeMap.includes(type)) {
    return Promise.reject(new Error("参数不正确"));
  }
  return api.get(`/user/${type}`, { params }).catch(() => {
    // 错误处理
    return resArray;
  });
};

/**
 * 查找附近的人
 * @author jsonleex <jsonlseex@163.com>
 * @export
 * @param  {number} options.lng: longitude    经度
 * @param  {number} options.lat: latitude     纬度
 * @param  {number} page                      当前页
 * @returns {Promise<UserObject[]>}
 */
export const findNearbyUser = ({ lng: longitude, lat: latitude }, page = 0) => {
  const params = {
    limit: 10,
    longitude,
    latitude
  };
  page > 0 && (params.page = page);

  return api
    .get("around-amap", { params })
    .then(data => data)
    .catch(() => resArray);
};

/**
 * 获取用户基本信息
 * 优先返回本地数据
 * @author jsonleex <jsonlseex@163.com>
 * @export
 * @param  {number} id
 * @returns {Promise<UserObject>}
 */
export const getUserInfoById = (id, force = false) => {
  const user = userState[`user_${id}`];
  if (user && !force) return user;

  return api
    .get(`/users/${id}`, { validateStatus: s => [404, 201, 200].includes(s) })
    .then(({ data }) => {
      data = data.id ? data : {};
      vuex.commit("SAVE_USER", data);
      return userState[`user_${id}`];
    });
};

/**
 * 获取用户粉丝列表
 * @author jsonleex <jsonlseex@163.com>
 * @export
 * @param  {number} options.uid
 * @param  {string} options.type
 * @param  {number} options.offset
 * @returns {Promise<UserObject[]>}
 */
export function getUserFansByType({ uid, type, limit = 15, offset = 0 }) {
  const params = {
    limit,
    offset
  };
  return api
    .get(`/users/${uid}/${type}`, { params })
    .then(({ data = [] }) => data)
    .catch(err => {
      console.warn(err);
      return [];
    });
}

/**
 * 注册
 * @author mutoe <mutoe@foxmail.com>
 * @export
 * @param {Object} payload
 * @param {string} payload.login login account
 * @param {string} payload.password
 * @returns {Promise<boolean>}
 */
export function signinByAccount(payload) {
  return api.post(`/auth/login`, payload, { validateStatus: s => s > 0 }).then(
    ({ data: { message, access_token /*token_type = "bearer"*/ }, status }) => {
      switch (status) {
        case 422:
          $Message.error(message);
          return false;
        case 200:
          lstore.setData(
            "H5_ACCESS_TOKEN",
            `Bearer ${access_token}`
            // `${token_type} ${access_token}`
          );
          refreshCurrentUserInfo();
          return true;
      }
    },
    err => {
      console.warn(err);
      return false;
    }
  );
}

/**
 * 刷新用户信息
 * @author jsonleex <jsonlseex@163.com>
 * @export
 * @returns {Promise<UserObject>}
 */
export function refreshCurrentUserInfo() {
  return api.get(`/user`).then(
    ({ data }) => {
      // 保存本地
      lstore.setData("H5_CUR_USER", data);
      // 保存 vuex
      vuex.commit("SAVE_CURRENTUSER", data);
      return data;
    },
    err => {
      console.warn(err);
    }
  );
}

/**
 * 上传用户主页背景图
 * @author mutoe <mutoe@foxmail.com>
 * @export
 * @param {File} file 图像文件
 */
export function uploadUserBanner(file) {
  const formData = new FormData();
  formData.append("image", file);
  return api.post(`/user/bg`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
    validateStatus: s => s === 204
  });
}

/**
 * 打赏用户
 * @author mutoe <mutoe@foxmail.com>
 * @export
 * @param {number} userId
 * @param {Object} data
 * @param {number} data.amount 打赏金额
 * @returns
 */
export function rewardUser(userId, data) {
  const url = `/user/${userId}/new-rewards`;
  return api.post(url, data, { validateStatus: s => s === 201 });
}
