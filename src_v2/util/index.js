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