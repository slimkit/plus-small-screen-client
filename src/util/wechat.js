export default () => {
  const ua = navigator.userAgent.toLowerCase(); // 获取判断用的对象
    if (ua.match(/MicroMessenger/i) == "micromessenger") {
      return true;
    }
    return false;
}