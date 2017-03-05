/* views */
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import FindPassword from '../views/FindPassword.vue';
import Feeds from '../views/Feeds.vue';
import Home from '../views/Home.vue';

const routes = [
  {
    path: '/',
    component: Home
  },
  {
    path: '/login',
    component: Login
    // beforeEnter: loggedAuth
  },
  {
    path: '/register',
    component: Register
  },
  {
    path: '/findpassword',
    component: FindPassword
  },
  {
    path: '/feeds',
    component: Feeds
  }
];

export default routes;
