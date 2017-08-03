import { app } from '../index';
import storeLocal from 'store';
import router from '../routers/index';

// 判断是否可以进入目标路由
function requestAuth (to, from, next) {
  let UserLoginInfo = storeLocal.get('UserLoginInfo') || {};
  if(UserLoginInfo.token) {
    next();
  } else {
    next({
      path: '/login',
      query: {
        redirect: to.fullPath
      }
    });
  }
}

// 登录状况不能进入的页面
function CanNotGetInWhenLogged (to, from, next) {
  let UserLoginInfo = storeLocal.get('UserLoginInfo') || {};
  if(UserLoginInfo.token) {
    next({
      path: '/feeds/new',
      query: {
        redirect: to.fullPath
      }
    });
  } else {
    next();
  }
}

// 退出登录
function logout () {
  storeLocal.set('UserLoginInfo', {});
  debugger;
  router.push({ path: '/login' });
}

export { 
  requestAuth,
  CanNotGetInWhenLogged,
  logout
};
