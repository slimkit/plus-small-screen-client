/**
 * 修改连接的统一方法
 */
import router from '../routers/index';

function changeUrl (link) {
  router.push(link);
};

function goTo (num) {
  router.go(num);
};

export {
  changeUrl,
  goTo
};
