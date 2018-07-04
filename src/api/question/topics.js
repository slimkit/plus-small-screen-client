import request from "../../http";

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
  return request.get("/question-topics", {
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

export function userQuery(query = {}) {
  return request.get("/user/question-topics", {
    params: query,
    validateStatus: status => status === 200
  });
}

export function followTopics(after = 0, limit = 15) {
  return userQuery({ after, limit, type: "follow" });
}

/**
 * Follow a topic.
 *
 * @param {number} id
 * @return {Promise}
 * @author Seven Du <shiweidu@outlook.com>
 */
export function follow(id) {
  return request.put(
    `/user/question-topics/${id}`,
    {},
    {
      validateStatus: status => status === 201
    }
  );
}

/**
 * Unfollow a topic.
 *
 * @param {number} id
 * @return {Promise}
 * @author Seven Du <shiweidu@outlook.com>
 */
export function unfollow(id) {
  return request.delete(`/user/question-topics/${id}`, {
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
  return request.get(`/question-topics/${topic}`, {
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
  return request.get(`/question-topics/${topic}/questions`, {
    params: { type, offset, limit },
    validateStatus: status => status === 200
  });
}
