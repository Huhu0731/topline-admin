import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './styles/index.less'
// 引入 nprogress 的css样式
import 'nprogress/nprogress.css'
import axios from 'axios'
// 解决后端返回数据中数字超出 JavaScript 安全整数范围问题
import JSONbig from 'json-bigint'

// 配置axios的基础路径
axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/mp/v1_0/'
// axios.defaults.baseURL = 'http://toutiao.course.itcast.cn/mp/v1_0/'
// 往Vue 的原型中添加成员
Vue.prototype.$http = axios

/**
 * 解决后端返回数据中数字超出 JavaScript 安全整数范围问题
 * axios 解析完的对象中的数字已经有问题了。
 * 对于这种问题，axios 给你提供了一个 API，可以手动解析原始数据。
 * 我们就可以在 axios 提供的那个 API 中使用 json-biginit 去解析含有超出安全整数范围的 json 内容数据。
 * 它会将 json 转为 JavaScript 对象，它自动判断内容中数字如果超出安全整数范围，自动处理成其他格式
 * JSONbig.parse(json);
 */

axios.defaults.transformResponse = [function (data) {
  // console.log(data)
  // 这里使用 JSONbig.parse 转换原始数据
  // 类似于 JSON.parse
  // 但是它会处理其中超出安全整数范围的整数问题。
  // 严谨一点，如果 data 不是 json 格式字符串就会报错
  try {
    // 如果是 json 格式字符串，那就转换并返回给后续使用
    return JSONbig.parse(data)
  } catch (err) {
    // 报错就意味着 data 不是 json 格式字符串，这里就直接原样返回给后续使用
    return data
  }
}]

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
  // response.data是对象 并且这个对象中有data属性
  if (typeof response.data === 'object' && response.data.data) {
    return response.data.data
  } else {
    return response.data
  }
}, error => { // >= 400的状态码会进入这里
  // console.dir(error) // response.status为401 说明token过期或者无效 让用户重新登陆
  if (error.response.status === 401) {
    // 务必删除本地存储信息
    window.localStorage.removeItem('user_info')
    router.push({ name: 'login' })
  }
  return Promise.reject(error)
})

Vue.use(ElementUI)
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
