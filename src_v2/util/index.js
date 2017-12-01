/**
 * 驼峰命名
 *     @author jsonleex <jsonlseex@163.com>
 */
export const str2Hump = (str) => {
    return str.replace(/-(\w)/g, ($0, $1) => {
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

/**
 * 判断终端类型
 *     @author jsonleex <jsonlseex@163.com>
 */
const OS = () => {
    const u = navigator.userAgent,
        app = navigator.appVersion;

    const

        isWebApp = u.indexOf('Safari') == -1,
        isMobile = !!u.match(/AppleWebKit.*Mobile.*/),

        /* 移动端 */
        isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
        isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1,
        isIPhone = u.indexOf('iPhone') > -1,
        isIPad = u.indexOf('iPad') > -1;

    return {
        isMobile,
        mobileOS: (() => {
            if(isIOS){
                return 
            }
        })(),
        versions: (() => {
            return {
                /* IE内核 */
                trident: u.indexOf('Trident') > -1,
                /* opera内核 */
                presto: u.indexOf('Presto') > -1,
                /* 苹果、谷歌内核 */
                webKit: u.indexOf('AppleWebKit') > -1,
                /* 火狐内核 */
                gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1,

                /* 是否为移动终端 */
                mobile: !!u.match(/AppleWebKit.*Mobile.*/),
                /* ios终端 */
                ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
                /* android终端或uc浏览器 */
                android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1,
                /* 是否为iPhone或者QQHD浏览器 */
                iPhone: u.indexOf('iPhone') > -1,
                /* 是否iPad */
                iPad: u.indexOf('iPad') > -1,
                /* 是否web应该程序，没有头部与底部 */
                webApp: u.indexOf('Safari') == -1
            };
        })(),
        language: (navigator.browserLanguage || navigator.language).toLowerCase()
    }
}