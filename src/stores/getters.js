export default {
  getUserById: ({ USERS }) => id => {
    return USERS[`user_${id}`] || {};
  },

  /**
   * 根据广告位标识获取广告位信息
   * @param {string} type
   * @returns {Object}
   */
  getAdTypeBySpace: ({ ADVERTISEMENT }) => type => {
    return ADVERTISEMENT.type.filter(ad => ad.space === type).pop() || {};
  }
};
