// 从 window 上取 高德api
const AMap = window.AMap
const errorFormat = (error) => {
  switch (error.code) {
    case error.TIMEOUT:
      return ('获取定位信息超时，请手动选择城市')
    case error.POSITION_UNAVAILABLE:
      return ('定位失败，当前位置信息不可用，请稍后重试')
    case error.PERMISSION_DENIED:
      return ('定位失败，系统拒绝了定位请求，请打开GPS定位功能')
    case error.UNKNOWN_ERROR:
      return ('定位失败，出现未知错误')
    default:
      return (error)
  }
}
export default() => {
  return new Promise((resolve, reject) => {
    if (AMap) {
      let MyMap = new AMap.Map('iCenter')
      MyMap.plugin('AMap.Geolocation', function () {
        let geolocation = new AMap.Geolocation({
          // 是否使用高精度定位，默认:true
          enableHighAccuracy: true,
          // 超过10秒后停止定位，默认：无穷大
          timeout: 20000,
          // 默认为false，设置为true的时候可以调整PC端为优先使用浏览器定位，失败后使用IP定位
          GeoLocationFirst: true,
          // 定位结果缓存0毫秒，默认：0
          maximumAge: 30000,
          // 自动偏移坐标，偏移后的坐标为高德坐标，默认：true
          convert: true
        })
        MyMap.addControl(geolocation)
        geolocation.getCurrentPosition()
        AMap.event.addListener(geolocation, 'complete', resolve) // 返回定位信息
        AMap.event.addListener(geolocation, 'error', (data) => {
          reject(errorFormat(data))
        }) // 返回定位出错信息
      })
    } else {
      reject(new Error('你的浏览器不支持定位'))
    }
  })
}
