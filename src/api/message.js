import api, { get, limit } from "./api.js";

// 获取系统通知
export function getNotifications(offset = 0) {
  return get(`/user/notifications`, {
    offset,
    limit
  });
}

/**
 * 清除未读提示
 * @Author   Wayne
 * @DateTime 2018-05-05
 * @Email    qiaobin@zhiyicx.com
 * @param    {String}            type [清除的消息类型]
 * @return   {[type]}                 [description]
 */
export function resetUserCount(type = "") {
  api.patch("/user/counts", {
    type
  });
}
