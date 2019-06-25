import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './styles/index.less'
// 引入 nprogress 的css样式
import 'nprogress/nprogress.css'
import axios from 'axios'

// 配置axios的基础路径
axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/mp/v1_0/'
// 往Vue 的原型中添加成员
Vue.prototype.$http = axios

/**
 * Axios 请求拦截器
 * 所有使用 axios 发起的请求都要先经过这里
 * config 是本次请求相关的配置对象
 * return config 就是允许通过的方式
 */
axios.interceptors.request.use(config => {
  const userInfo = JSON.parse(window.localStorage.getItem('user_info'))
  // 还需判断一下
  // 没有登陆是没有token
  if (userInfo) {
    config.headers.Authorization = `Bearer ${userInfo.token}`
  }
  return config
}, error => {
  return Promise.reject(error)
})
/**
 * Axios 响应拦截器
 * 服务器返回数据到浏览器之前都会经过这里
 * 统一处理相应数据
 */
axios.interceptors.response.use(response => {
  // response 就是发送axios请求后.then(res=>{})中的res
  return response.data.data
}, error => {
  return Promise.reject(error)
})

Vue.use(ElementUI)
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
