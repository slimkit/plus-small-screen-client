// 定义空函数
const fuc = () => {};

// 从 window 上取 高德api
const AMap = window.AMap;

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
                maximumAge: 0, //定位结果缓存0毫秒，默认：0
                convert: true, //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
            });
            MyMap.addControl(geolocation);
            geolocation.getCurrentPosition();
            AMap.event.addListener(geolocation, 'complete', success); //返回定位信息
            AMap.event.addListener(geolocation, 'error', error); //返回定位出错信息
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
