import api from "../api";

/**
 * Query questions list.
 * @author Seven Du <shiweidu@outlook.com>
 * @export
 * @param {Object} params
 * @param {string} params.type default: 'new', options: 'all', 'new', 'hot', 'reward', 'excellent'
 * @param {number} params.limit
 * @param {number} params.offset
 * @param {string} params.subject search keyword
 * @returns
 */
export function queryList(params = {}) {
  return api.get("/questions", {
    params,
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
  return api.get(`/questions/${id}`, {
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
  return api.put(
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
  return api.delete(`/user/question-watches/${id}`, {
    validateStatus: status => status === 204
  });
}
