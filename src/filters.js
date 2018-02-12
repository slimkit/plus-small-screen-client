import plueMessageBundle from 'plus-message-bundle';

/**
 * ThinkSNS Plus 消息解析器，获取顶部消息.
 *
 * @param {Object} message
 * @param {String} defaultMessage
 * @return {String}
 * @author Seven Du <shiweidu@outlook.com>
 */
export function plusMessageFirst(message, defaultMessage) {
  return plueMessageBundle(message, defaultMessage).getMessage();
}

/**
 * 格式化 时间
 * @author Jsonleex <jsonlseex@163.com>
 * @param  {String}
 * @return {String}
 */

export const time2txt = str => {
  if (!str) return '';

  // 兼容 IOS 保证传入数据格式 YYYY/MM/dd HH:mm:ss
  let date = new Date(str.replace(/-/g, '/'));

  // 现在的时间-传入的时间 = 相差的时间（单位 = 毫秒）
  let time = new Date().getTime() - date.getTime();

  if (time < 0) {
    return '';
  } else if (time / 3600000 < 24) {
    return '今天';
  } else {
    return date.getMonth() + 1 + '月' + date.getDate();
  }
};

/**
 * 时区转换
 */
export const UTC2localTime = UTCDateString => {
  if (!UTCDateString) {
    return '-';
  }

  function formatFunc(str) {
    // 格式化显示
    return str > 9 ? str : '0' + str;
  }
  var date2 = new Date(UTCDateString); // 这步是关键
  var year = date2.getFullYear();
  var mon = formatFunc(date2.getMonth() + 1);
  var day = formatFunc(date2.getDate());
  var hour = date2.getHours();
  var noon = hour >= 12 ? 'PM' : 'AM';
  hour = hour >= 12 ? hour - 12 : hour;
  hour = formatFunc(hour);
  var min = formatFunc(date2.getMinutes());
  var dateStr =
    year + '-' + mon + '-' + day + ' ' + noon + ' ' + hour + ':' + min;
  return dateStr;
};

/**
 * 格式化 时间提示
 * @author Jsonleex <jsonlseex@163.com>
 * @param  {String}
 * @return {String}
 */
export const time2tips = str => {
  if (!str) return '';

  // 兼容 IOS 保证传入数据格式 YYYY/MM/dd HH:mm:ss
  let date = new Date(str.replace(/-/g, '/'));

  // 现在的时间-传入的时间 = 相差的时间（单位 = 毫秒）
  let time = new Date().getTime() - date.getTime();

  if (time < 0) {
    return '';
  } else if (time / 1000 < 30) {
    return '刚刚';
  } else if (time / 1000 < 60) {
    return parseInt(time / 1000) + '秒前';
  } else if (time / 60000 < 60) {
    return parseInt(time / 60000) + '分钟前';
  } else if (time / 3600000 < 24) {
    return parseInt(time / 3600000) + '小时前';
  } else if (time / 86400000 < 31) {
    return parseInt(time / 86400000) + '天前';
  } else if (time / 2592000000 < 12) {
    return parseInt(time / 2592000000) + '月前';
  } else {
    return parseInt(time / 31536000000) + '年前';
  }
};

/**
 * 格式化数字
 *     @author jsonleex <jsonlseex@163.com>
 */
export const formatNum = num => {
  if (typeof ~~num === 'number') {
    if (num === 0) return '0';
    const k = 1000;
    const sizes = ['', 'K', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'];
    const i = Math.floor(Math.log(num) / Math.log(k));
    return num / Math.pow(k, i) + ' ' + sizes[i];
  }
  return '0';
};
