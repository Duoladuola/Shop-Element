import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const Login = () => import('components/common/login/Login')
const Home = () => import('views/home/Home')
const Welcome = () => import('views/home/childCpn/Welcome')
const Users = () => import('views/home/childCpn/Users')
const Rights = () => import('views/home/childCpn/power/Rights')
const Roles = () => import('views/home/childCpn/power/Roles')
const Category = () => import('views/home/childCpn/goods/Category')
const Params = () => import('views/home/childCpn/goods/Params')

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
      { path: '/params', component: Params }
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
