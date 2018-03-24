import timeago from "timeago.js";
import plueMessageBundle from "plus-message-bundle";

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
 * ThinkSNS Plus 消息解析器，获取顶部消息.
 *
 * @param {Object} message
 * @param {String} defaultMessage
 * @return {String}
 * @author Seven Du <shiweidu@outlook.com>
 */
export function plusMessageAnalyze(message, defaultMessage) {
  return plueMessageBundle(message, defaultMessage).getMessage();
}

/**
 * 格式化 时间
 * @author Jsonleex <jsonlseex@163.com>
 * @param  {String}
 * @return {String}
 */

export const time2txt = str => {
  if (!str) return "";

  // 兼容 IOS 保证传入数据格式 YYYY/MM/dd HH:mm:ss
  let date = new Date(str.replace(/-/g, "/"));

  // 现在的时间-传入的时间 = 相差的时间（单位 = 毫秒）
  let time = new Date().getTime() - date.getTime();

  if (time < 0) {
    return "";
  } else if (time / 3600000 < 24) {
    return "今天";
  } else {
    const M = (date.getMonth() + 1 + "").padStart(2, "0");
    const D = (date.getDate() + "").padStart(2, "0");
    return M + "月" + D;
  }
};

/**
 * 时区转换
 */
export const UTC2localTime = UTCDateString => {
  if (!UTCDateString) {
    return "-";
  }

  function formatFunc(str) {
    // 格式化显示
    return str > 9 ? str : "0" + str;
  }
  var date2 = new Date(UTCDateString); // 这步是关键
  var year = date2.getFullYear();
  var mon = formatFunc(date2.getMonth() + 1);
  var day = formatFunc(date2.getDate());
  var hour = date2.getHours();
  var noon = hour >= 12 ? "PM" : "AM";
  hour = hour >= 12 ? hour - 12 : hour;
  hour = formatFunc(hour);
  var min = formatFunc(date2.getMinutes());
  var dateStr =
    year + "-" + mon + "-" + day + " " + noon + " " + hour + ":" + min;
  return dateStr;
};

// 时差
const timeOffset = new Date().getTimezoneOffset() * 60 * 1000;

export const dateFormat = timeago(null, "zh_CN");
export const time2tips = date => {
  return dateFormat.format(
    new Date(date.replace(/-/g, "/")).getTime() - timeOffset
  );
};

/**
 * 格式化数字
 *     @author jsonleex <jsonlseex@163.com>
 */
export const formatNum = (a = 0) => {
  return (
    a > 0 &&
      (a > 99999999 && (a = Math.floor(a / 1e8) + "亿"),
      a > 9999 &&
        (a =
          a > 99999999
            ? Math.floor(a / 1e8) + "亿"
            : Math.floor(a / 1e4) + "万")),
    a
  );
};

/**
 * Markdown to text fiter.
 *
 * @param {string} markdown
 * @return {string}
 * @author Seven Du <shiweidu@outlook.com>
 */
export function markdownText(markdown) {
  return require("./util/markdown").syntaxTextAndImage(markdown).text;
}
