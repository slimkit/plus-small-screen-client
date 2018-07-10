import api from "./api";

/**
 * 申请认证
 * @author mutoe <mutoe@foxmail.com>
 * @export
 * @param {Object} payload
 * @param {string} payload.type 'user' or 'org'
 * @param {string} payload.name 真实姓名 or 负责人名字
 * @param {string} payload.phone 用户联系方式 or 负责人联系方式
 * @param {string} payload.number 身份证号码 or 营业执照注册号
 * @param {string} payload.desc 认证描述
 * @param {string} [payload.org_name] 企业或机构名称
 * @param {string} [payload.org_address] 企业或机构地址
 * @param {number[]} [payload.files]
 * @returns
 */
export function postCertification(payload) {
  const url = "/user/certification";
  return api.post(url, payload, { validateStatus: s => s === 201 });
}
