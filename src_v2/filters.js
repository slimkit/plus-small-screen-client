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
 * 格式化 时间提示
 * @author Jsonleex <jsonlseex@163.com>
 * @param  {String}
 * @return {String}
 */
export const time2tips = (str) => {
    if(!str) return '';

    // 兼容 IOS 保证传入数据格式 YYYY/MM/dd HH:mm:ss 
    let date = new Date(str.replace(/\-/g, '/'));

    // 现在的时间-传入的时间 = 相差的时间（单位 = 毫秒）
    let time = new Date().getTime() - date.getTime()

    if(time < 0) {
        return ''
    } else if((time / 1000 < 30)) {
        return '刚刚'
    } else if(time / 1000 < 60) {
        return parseInt((time / 1000)) + '秒前'
    } else if((time / 60000) < 60) {
        return parseInt((time / 60000)) + '分钟前'
    } else if((time / 3600000) < 24) {
        return parseInt(time / 3600000) + '小时前'
    } else if((time / 86400000) < 31) {
        return parseInt(time / 86400000) + '天前'
    } else if((time / 2592000000) < 12) {
        return parseInt(time / 2592000000) + '月前'
    } else {
        return parseInt(time / 31536000000) + '年前'
    }
}