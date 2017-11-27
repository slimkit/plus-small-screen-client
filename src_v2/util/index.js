/**
 * 驼峰命名
 *     @author jsonleex <jsonlseex@163.com>
 */
export const str2Hump = (str) => {
    var r = /-(\w)/g;
    return str.replace(r, function($0, $1) {
        return $1.toUpperCase();
    });
}

/**
 * 验证数据是否有效
 *     @author jsonleex <jsonlseex@163.com>
 */
export const oneOf = (value, validList) => {
    return validList.indexOf(value) > -1;
}

/**
 * 获取样式
 *     @author jsonleex <jsonlseex@163.com>
 */
export const getStyle = (element, attr, NumberMode = 'int') => {
    let target;
    if(attr === 'scrollTop') {
        target = element.scrollTop;
    } else if(element.currentStyle) {
        target = element.currentStyle[attr];
    } else {
        target = document.defaultView.getComputedStyle(element, null)[attr];
    }
    //在获取 opactiy 时需要获取小数 parseFloat
    // return NumberMode == 'float' ? parseFloat(target) : parseInt(target);
    return target;
}