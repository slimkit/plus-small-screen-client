import http from "@/http.js";
export const signinByWechat = () => {
  const redirectUrl = window.location.origin + "/wechat/";
  http
    .post("socialite/getOriginUrl", {
      redirectUrl,
      validateStatus: s => s === 200
    })
    .then(({ data: { url = "" } = {} }) => {
      window.location.href = url;
    });
};
