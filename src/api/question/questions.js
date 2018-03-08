import request from "../../http";

/**
 * Query questions list.
 *
 * @param {Object} query
 * @return {Promise}
 * @author Seven Du <shiweidu@outlook.com>
 */
function queryList(query = {}) {
  return request.get("/questions", {
    params: query,
    validateStatus: status => status === 200
  });
}

/**
 * All questions.
 *
 * @param {string} type
 * @param {number} offset
 * @param {number} limit
 * @return {Promise}
 * @author Seven Du <shiweidu@outlook.com>
 */
export function list(type, offset = 0, limit = 15) {
  return queryList({ type, limit, offset });
}

/**
 * show a question.
 *
 * @param {number} id
 * @return {Promise}
 * @author Seven Du <shiweidu@outlook.com>
 */
export function show(id) {
  return request.get(`/questions/${id}`, {
    validateStatus: status => status === 200
  });
}

/**
 * Watch a question.
 *
 * @param {number} id
 * @return {Promise}
 * @author Seven Du <shiweidu@outlook.com>
 */
export function watch(id) {
  return request.put(
    `/user/question-watches/${id}`,
    {},
    {
      validateStatus: status => status === 204
    }
  );
}

/**
 * unwatch a question.
 *
 * @param {number} id
 * @return {Promise}
 * @author Seven Du <shiweidu@outlook.com>
 */
export function unwatch(id) {
  return request.delete(`/user/question-watches/${id}`, {
    validateStatus: status => status === 204
  });
}
