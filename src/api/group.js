import api, { get } from "./api.js";
import vuex from "@/stores/index.js";

/**
 * 获取圈子总数
 * @author jsonleex <jsonlseex@163.com>
 * @return {Promise -> Number}
 */
export function getGroupTotalNumber() {
  return get("/plus-group/groups/count").then(
    ({ data: { count = 0 } }) => {
      return count;
    },
    err => {
      console.log(err);
      return 0;
    }
  );
}

/**
 * 获取圈子全部分类
 * @author jsonleex <jsonlseex@163.com>
 * @return {Promise -> Array}
 */
export function getGroupCates() {
  return get(`/plus-group/categories`)
    .then(({ data = [] }) => {
      vuex.commit("SAVE_GROUP_CATES", data);
    })
    .catch(err => {
      console.log(err);
      vuex.commit("SAVE_GROUP_CATES", []);
    });
}

/**
 * 获取我加入的圈子
 * @author jsonleex <jsonlseex@163.com>
 * @return {Promise -> Array}
 */
export function getMyGroups() {
  return get("/plus-group/user-groups").then(
    ({ data = [] }) => data,
    err => (err, [])
  );
}

/**
 * 获取推荐圈子
 * @author jsonleex <jsonlseex@163.com>
 * @return {Promise -> Array}
 */
export function getRecGroups() {
  return get("/plus-group/recommend/groups?type=random").then(
    ({ data = [] }) => {
      return Array.isArray(data) ? data : [];
    },
    err => (err, [])
  );
}

/**
 * 加入圈子
 * @author jsonleex <jsonlseex@163.com>
 * @param  {Number} GID
 * @return {[type]}
 */
export function joinGroup(GID) {
  return api.put(`/plus-group/groups/${GID}`, {
    validateStatus: s => s === 201
  });
}

/**
 * 获取指定用户已加入的圈子列表
 * @author jsonleex <jsonlseex@163.com>
 * @param  {Number} UID
 * @return {Promise -> Array}
 */
export function getGroupsByUser(UID, limit = 15, offset = 0) {
  // plus-group/groups/users
  return get(
    `/plus-group/groups/users?user_id=${UID}&limit=${limit}&offset=${offset}`
  );
}

/**
 * 获取指定分类下的圈子列表
 * @author jsonleex <jsonlseex@163.com>
 * @param  {Number} cate    分类id (cate === -1  && 获取推荐圈子)
 * @param  {Number} limit
 * @param  {Number} offset
 * @return {Promise -> Array}
 */
export function getGroupsByCate(cate = -1, limit = 15, offset = 0) {
  const url =
    cate > -1
      ? `/plus-group/groups?category_id=${cate}`
      : "/plus-group/recommend/groups";
  return get(url, { limit, offset })
    .then(({ data = [] }) => {
      return data;
    })
    .catch(err => {
      console.log(err);
      return [];
    });
}

/**
 * 收藏圈子帖子
 * @author jsonleex <jsonlseex@163.com>
 * @param  {Number} postId
 * @param  {Boolean} status
 */
export function collectGroupPost(postId, status) {
  const url = status
    ? `/plus-group/group-posts/${postId}/uncollect`
    : `/plus-group/group-posts/${postId}/collections`;
  const method = status ? "delete" : "post";
  return api({ method, url, validateStatus: s => s === 201 || s === 204 });
}

/**
 * 获取指定圈子的圈子详情
 * @author jsonleex <jsonlseex@163.com>
 * @param  {Number} groupID
 * @return {Promise -> Object}
 */
export function getGroupInfoById(groupID) {
  return get(`/plus-group/groups/${groupID}`).then(
    ({ data = {} }) => {
      // TODO 错误处理
      if (data.message === "未加入该圈子") {
        throw data;
      }
      return data;
    },
    err => {
      throw err;
    }
  );
}

export function getGroudFeedsByType(
  groupID,
  type = "latest_post",
  limit = 15,
  offset = 0
) {
  // /groups/:group/posts
  return get(
    `/plus-group/groups/${groupID}/posts?type=${type}&offset=${offset}&limit=${limit}`
  ).then(
    ({ data }) => {
      return data;
    },
    err => {
      console.log(err);
      return { pinneds: [], posts: [] };
    }
  );
}
