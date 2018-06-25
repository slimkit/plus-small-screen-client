import forgot from "@/page/sign/forgot";
import changePassword from "@/page/sign/changePassword";
import signup from "@/page/sign/signup.vue";
import signin from "@/page/sign/signin.vue";
import registerProtocol from "@/page/sign/registerProtocol";

export default [
  {
    path: "/signin",
    component: signin,
    meta: {
      title: "登录",
      forGuest: true
    }
  },
  {
    path: "/signup",
    component: signup,
    meta: {
      title: "注册",
      forGuest: true
    }
  },
  {
    path: "/signup/protocol",
    component: registerProtocol,
    meta: {
      title: "用户注册协议"
    }
  },
  {
    path: "/forgot",
    component: forgot,
    meta: {
      title: "忘记密码"
    }
  },
  {
    path: "/changePassword",
    component: changePassword,
    meta: {
      title: "修改密码"
    }
  }
];
