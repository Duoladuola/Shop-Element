import Axios from 'axios'
// 美化：加进度条
import NProgress from 'nprogress'
// 通过cdn引入了
// import 'nprogress/nprogress.css'
export function request (config) {
  // 1、创建axios实例
  const instance = Axios.create({
    baseURL: 'http://127.0.0.1:8888/api/private/v1/',
    timeout: 5000
  })
  // 2、请求的响应和拦截，这个案例里面不需要，但是也可以写着
  // 2.1 请求拦截
  instance.interceptors.request.use(config => {
    config.headers.Authorization = window.sessionStorage.getItem('token')
    NProgress.start()
    return config
  }, err => {
    console.log(err)
  })
  // 2.2 响应拦截
  instance.interceptors.response.use(res => {
    NProgress.done()
    return res.data
  }, err => {
    console.log(err)
  })
  // 3、返回网络请求的实例（promise）
  return instance(config)
}
