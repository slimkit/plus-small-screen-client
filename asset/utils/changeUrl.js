/**
 * 修改连接的统一方法
 */
import router from '../routers/index';

function changeUrl (link) {
  router.replace(link);
};

function goTo (num) {
  console.log(num);
  router.go(num);
};

export {
  changeUrl,
  goTo
};
