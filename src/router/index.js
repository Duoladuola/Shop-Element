import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
// 一组
const Login = () => import(/* webpackChunkName: "login-home-welcome" */ 'components/common/login/Login')
const Home = () => import(/* webpackChunkName: "login-home-welcome" */ 'views/home/Home')
const Welcome = () => import(/* webpackChunkName: "login-home-welcome" */ 'views/home/childCpn/Welcome')
// 二组
const Users = () => import(/* webpackChunkName: "user-right-role" */ 'views/home/childCpn/Users')
const Rights = () => import(/* webpackChunkName: "user-right-role" */ 'views/home/childCpn/power/Rights')
const Roles = () => import(/* webpackChunkName: "user-right-role" */ 'views/home/childCpn/power/Roles')
// 三组
const Category = () => import(/* webpackChunkName: "cate-params" */ 'views/home/childCpn/goods/Category')
const Params = () => import(/* webpackChunkName: "cate-params" */ 'views/home/childCpn/goods/Params')
// 四组
const GoodsList = () => import(/* webpackChunkName: "good-addgood" */ 'views/home/childCpn/goods/GoodsList')
const Add = () => import(/* webpackChunkName: "good-addgood" */ 'views/home/childCpn/goods/Add')
// 五组
const Order = () => import(/* webpackChunkName: "order-report" */ 'views/home/childCpn/order/Order')
const Report = () => import(/* webpackChunkName: "order-report" */ 'views/home/childCpn/report/Report')

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    redirect: '/welcome',
    component: Home,
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles },
      { path: '/categories', component: Category },
      { path: '/params', component: Params },
      { path: '/goods', component: GoodsList },
      { path: '/goods/add', component: Add },
      { path: '/orders', component: Order },
      { path: '/reports', component: Report }
    ]
  }
]

const router = new VueRouter({
  routes
})
// 挂载路由导航守卫
// to:跳转到哪个页面
// from： 从哪个页面来
// next（） 直接放行到to
// next（‘路径’）强制跳转到某路径
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const sessionToken = window.sessionStorage.getItem('token')
  if (!sessionToken) {
    return next('/login')
  }
  next()
})
export default router
