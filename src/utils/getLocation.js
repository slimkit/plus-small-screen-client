// 定义空函数
const fuc = () => {};

// 从 window 上取 高德api
const AMap = window.AMap;

const errorFormat = (error)=>{
        switch (error.code) {
        case error.TIMEOUT:
            return ('获取定位信息超时，请手动选择城市');
        case error.POSITION_UNAVAILABLE:
            return ('定位失败，当前位置信息不可用，请稍后重试');
        case error.PERMISSION_DENIED:
            return ('定位失败，系统拒绝了定位请求，请打开GPS定位功能');
        case error.UNKNOWN_ERROR:
            return ('定位失败，出现未知错误');
        default:
            return (error);
    }
};
const getLocation = ({
    success = fuc,
    error = fuc
} = {}) => {

    if (AMap) {
        let MyMap = new AMap.Map('iCenter');
        MyMap.plugin('AMap.Geolocation', function() {
            let geolocation = new AMap.Geolocation({
                enableHighAccuracy: true, //是否使用高精度定位，默认:true
                timeout: 10000, //超过10秒后停止定位，默认：无穷大
                GeoLocationFirst: true, // 默认为false，设置为true的时候可以调整PC端为优先使用浏览器定位，失败后使用IP定位
                maximumAge: 30000, //定位结果缓存0毫秒，默认：0
                convert: true, //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
            });
            MyMap.addControl(geolocation);
            geolocation.getCurrentPosition();
            AMap.event.addListener(geolocation, 'complete', success); //返回定位信息
            AMap.event.addListener(geolocation, 'error', (data)=>{
                error(errorFormat(data));
            }); //返回定位出错信息
        });
    }else{
        error("你的浏览器不支持定位");
    }

};

export default getLocation;

// /// getLocation
// const fuc = () => {};

// export default ({
//     success = fuc,
//     error = fuc
// } = {}) => {
//     if (navigator.geolocation) {
//         navigator.geolocation.getCurrentPosition(success, error, {
//             // 指示浏览器获取高精度的位置，默认为false  
//             enableHighAcuracy: true,
//             // 指定获取地理位置的超时时间，默认不限时，单位为毫秒  
//             // timeout: 5000,
//             // 最长有效期，在重复获取地理位置时，此参数指定多久再次获取位置。  
//             maximumAge: 5000
//         });
//     } else {
//         error("您的浏览器不支持定位功能");
//     }
// };
