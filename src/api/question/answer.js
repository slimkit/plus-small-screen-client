import api from "../api.js";

/**
 * List answers by default
 *
 * @param {number} question
 * @param {Number} offset
 * @param {Number} limit
 * @return {Promise}
 * @author Seven Du <shiweidu@outlook.com>
 */
export function listByDefault(question, offset = 0, limit = 15) {
  return api.get(`/questions/${question}/answers`, {
    params: { offset, limit, order_type: "default" },
    validateStatus: status => status === 200
  });
}

/**
 * List answers by time.
 *
 * @param {number} question
 * @param {Number} offset
 * @param {Number} limit
 * @return {Promise}
 * @author Seven Du <shiweidu@outlook.com>
 */
export function listByTime(question, offset = 0, limit = 15) {
  return api.get(`/questions/${question}/answers`, {
    params: { offset, limit, order_type: "time" },
    validateStatus: status => status === 200
  });
}

/**
 * Like a answer.
 *
 * @param {number} answer
 * @return {Promise}
 * @author Seven Du <shiweidu@outlook.com>
 */
export function like(answer) {
  return api.post(
    `/question-answers/${answer}/likes`,
    {},
    {
      validateStatus: status => status === 201
    }
  );
}

/**
 * Unlike a answer.
 *
 * @param {number} answer
 * @return {Promise}
 * @author Seven Du <shiweidu@outlook.com>
 */
export function unlike(answer) {
  return api.delete(`/question-answers/${answer}/likes`, {
    validateStatus: status => status === 204
  });
}

/**
 * Switch like status
 * @author jsonleex <jsonlseex@163.com>
 */
export function likeAnswersByStatus(answer, status) {
  return status ? unlike(answer) : like(answer);
}

/**
 * 获取回答
 * @author mutoe <mutoe@foxmail.com>
 * @export
 * @param {number} answerId
 * @returns
 */
export function getAnswer(answerId) {
  const url = `/question-answers/${answerId}`;
  return api.get(url, { validateStatus: s => s === 200 });
}

/**
 * 打赏回答
 * @author mutoe <mutoe@foxmail.com>
 * @export
 * @param {number} answerId
 * @param {Object} payload
 * @param {number} payload.amount 打赏金额
 * @returns
 */
export function rewardAnswer(answerId, payload) {
  const url = `/question-answers/${answerId}/new-rewards`;
  return api.post(url, payload, { validateStatus: s => s === 200 });
}

/**
 * 获取打赏列表
 * @author mutoe <mutoe@foxmail.com>
 * @export
 * @param {number} answerId
 * @param {Object} params
 * @param {string} [params.type = 'time'] time 按时间倒序 amount 按金额倒序
 * @param {number} [params.limit = 20] limit
 * @param {number} [params.offset = 0] offset
 * @returns
 */
export function getRewards(answerId, params) {
  const url = `/question-answers/${answerId}/rewarders`;
  return api.get(url, { params, validateStatus: s => s === 200 });
}
