import api from "../api.js";

/**
 * The topics API query function.
 * @author Seven Du <shiweidu@outlook.com>
 * @export
 * @param {Object} params
 * @param {number} params.limit
 * @param {number} params.offset
 * @param {*} params.follow
 * @param {string} params.name search keyword
 * @returns
 */
export function query(params = {}) {
  return api.get("/question-topics", {
    params,
    validateStatus: status => status === 200
  });
}

/**
 * Get all topic query method.
 *
 * @param {Number} offset
 * @param {Number} limit
 * @param {Boolean} follow
 * @return {Promise}
 * @author Seven Du <shiweidu@outlook.com>
 */
export function all(offset = 0, limit = 15, follow = true) {
  return query({ offset, limit, follow });
}

/**
 * Search topics method.
 *
 * @param {String} name
 * @param {Number} offset
 * @param {Number} limit
 * @param {Boolean} follow
 * @return {Promise}
 * @author Seven Du <shiweidu@outlook.com>
 */
export function search(name = null, offset = 0, limit = 15, follow = true) {
  return query({ name, offset, limit, follow });
}

export function userQuery(params = {}) {
  return api.get("/user/question-topics", {
    params,
    validateStatus: s => s === 200
  });
}

export function getFollowTopics(after = 0, limit = 15) {
  return userQuery({ after, limit, type: "follow" });
}

/**
 * Follow a topic.
 * @author Seven Du <shiweidu@outlook.com>
 * @param {number} topicId
 * @returns
 */
export function followTopic(topicId) {
  const url = `/user/question-topics/${topicId}`;
  return api.put(url, {}, { validateStatus: s => s === 201 });
}

/**
 * Unfollow a topic.
 *
 * @param {number} id
 * @return {Promise}
 * @author Seven Du <shiweidu@outlook.com>
 */
export function unfollowTopic(id) {
  return api.delete(`/user/question-topics/${id}`, {
    validateStatus: status => status === 204
  });
}

/**
 * Show a topic.
 *
 * @param {number} topic
 * @return {Promise}
 * @author Seven Du <shiweidu@outlook.com>
 */
export function show(topic) {
  return api.get(`/question-topics/${topic}`, {
    validateStatus: status => status === 200
  });
}

/**
 * Fetch question by topic.
 *
 * @param {number} topic
 * @param {string} type
 * @param {number} offset
 * @param {Number} limit
 * @return {Promise}
 * @author Seven Du <shiweidu@outlook.com>
 */
export function questions(topic, type, offset = 0, limit = 15) {
  return api.get(`/question-topics/${topic}/questions`, {
    params: { type, offset, limit },
    validateStatus: status => status === 200
  });
}
