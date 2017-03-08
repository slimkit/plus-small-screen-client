import localEvent from '../stores/localStorage';

// 判断是否可以进入目标路由
function requestAuth (to, from, next) {
  let UserLoginInfo = localEvent.getLocalItem('UserLoginInfo');
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

export default requestAuth;
