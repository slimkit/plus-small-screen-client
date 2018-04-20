import api from "@/api/api.js";
/**
 * 定位
 */
const script = document.createElement("script");
function switchError(error) {
  let message = "未知错误";
  switch (error.code) {
    case error.PERMISSION_DENIED:
      message = "定位失败，系统拒绝了定位请求";
      break;
    case error.POSITION_UNAVAILABLE:
      message = "定位失败，当前位置信息不可用";
      break;
    case error.TIMEOUT:
      message = "定位超时，请手动选择城市";
      break;
    case error.UNKNOWN_ERROR:
      message = "未知错误";
      break;
  }

  return message;
}
export default {
  isSupported: (() => {
    if (navigator && navigator.geolocation) {
      return true;
    } else {
      script.type = "text/javascript";
      script.src = `//webapi.amap.com/maps?v=1.3&key=${
        process.env.VUE_APP_LBS_GAODE_KEY
      }`;
      document.body.appendChild(script);
      console.log("Add Script");
      return false;
    }
  })(),
  getCurrentPosition(options) {
    options = Object.assign(
      {
        timeout: 20000,
        maximumAge: 30000, //应用程序的缓存时间
        enableHighAccuracy: true //boolean 是否要求高精度的地理信息，默认为false
      },
      options
    );
    return this.isSupported
      ? new Promise((resolve, resject) => {
          navigator.geolocation.getCurrentPosition(
          const geo = navigator.geolocation;
          geo.getCurrentPosition(
            position => {
              console.log(position);
              const { coords: { latitude, longitude } } = position;
              api
                .get(
                  `//restapi.amap.com/v3/geocode/regeo?location=${latitude},${longitude}&key=${
                    process.env.VUE_APP_LBS_GAODE_KEY
                  }`
                )
                .then(
                  ({
                    data: { infocode, regeocode: { formatted_address } = {} }
                  }) => {
                    if (infocode === "10000") {
                      resolve({
                        lat: latitude,
                        lng: longitude,
                        label: formatted_address
                      });
                    } else {
                      resject(new Error(`逆地理编码响应错误 ${infocode}`));
                    }
                  }
                );
            },
            error => {
              resject({ message: switchError(error) });
            },
            options
          );
        })
      : Promise.resject(new Error("你的浏览器不支持定位"));
    // new Promise((resolve, resject) => {
    //     // if (AMap) {
    //     //   let MyMap = new AMap.Map("iCenter");
    //     //   MyMap.plugin("AMap.Geolocation", () => {
    //     //     let geolocation = new AMap.Geolocation({
    //     //       GeoLocationFirst: true,
    //     //       maximumAge: 30000,
    //     //       convert: true,
    //     //       enableHighAccuracy: true,

    //     //       timeout: 10000, //超过10秒后停止定位，默认：无穷大
    //     //       extensions: "base"
    //     //     });
    //     //     MyMap.addControl(geolocation);
    //     //     geolocation.getCurrentPosition();
    //     //     AMap.event.addListener(geolocation, "complete", resolve); // 返回定位信息
    //     //     AMap.event.addListener(geolocation, "error", resject);
    //     //   });
    //     // } else {
    //     //   reject(new Error("请配置定位插件"));
    //     // }
    //     // if (window.AMap) {
    //     //   const MyMap = new AMap.Map("iCenter");
    //     //   MyMap.plugin("AMap.Geolocation", () => {
    //     //     let geolocation = new AMap.Geolocation({
    //     //       enableHighAccuracy: true, // 是否使用高精度定位，默认:true
    //     //       timeout: 20000, // 超过10秒后停止定位，默认：无穷大
    //     //       GeoLocationFirst: true, // 默认为false，设置为true的时候可以调整PC端为优先使用浏览器定位，失败后使用IP定位
    //     //       maximumAge: 30000, // 定位结果缓存0毫秒，默认：0
    //     //       convert: true // 自动偏移坐标，偏移后的坐标为高德坐标，默认：true
    //     //     });
    //     //     MyMap.addControl(geolocation);
    //     //     geolocation.getCurrentPosition();
    //     //     AMap.event.addListener(geolocation, "complete", resolve); // 返回定位信息
    //     //     AMap.event.addListener(geolocation, "error", error => {
    //     //       reject({ message: switchError(error) });
    //     //     });
    //     //   });
    //     // } else {
    //     //   resject(new Error("你的浏览器不支持定位"));
    //     // }
    //   });
  }
};
