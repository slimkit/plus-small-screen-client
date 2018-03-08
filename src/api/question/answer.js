import request from "../../http";

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
  return request.get(`/questions/${question}/answers`, {
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
  return request.get(`/questions/${question}/answers`, {
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
  return request.post(
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
  return request.delete(`/question-answers/${answer}/likes`, {
    validateStatus: status => status === 204
  });
}
