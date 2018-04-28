import { get } from "./api.js";
const uri = "/user/news/contributes";
/**
 * 获取当前用户投稿列表
 * @Author   Wayne
 * @DateTime 2018-04-28
 * @Email    qiaobin@zhiyicx.com
 * @param    {Number}   type [类型: 0: 已发布, 1: 待审核, 2: 已驳回]
 * @return   [Promise]
 */
export function getMyNews({ type = 0, limit = 15, after = 0 }) {
  return get(uri, {
    type,
    limit,
    after
  });
}
