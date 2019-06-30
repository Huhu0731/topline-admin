// 1. npm i vuex
// 2. 配置
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// 3. 创建容器对象
const store = new Vuex.Store({
  // state 中存储容器中的数据，类似于组件中的 data
  state: {
    // count: 0
    user: JSON.parse(window.localStorage.getItem('user_info'))
  },
  // mutations 类似于组件中的 methods
  // 记住一个原则：修改 state 永远通过 mutation 函数修改，不要在组件中去 this.$store.state.xxx = xxx
  // 函数自己定义，函数默认接收一个参数 state，也就是容器中的 state
  // 我们可以在 mutation 函数中去 state.xxx = xxx
  mutations: {
    // increment (state) {
    //   state.count++
    // }
    // 修改容器中数据
    changeUser (state, data) {
      // console.log(state, data)
      // 将传过来的数据data拷贝到数据state.user中
      Object.assign(state.user, data)
      // 将修改之后的用户信息更新到本地存储
      window.localStorage.setItem('user_info', JSON.stringify(state.user))
    }
  }
})

// 4. 导出容器对象
export default store

// 5. 在 main.js 中
//    import store from './store'
//    ...
//    new Vue({
//      ...
//      store
//      ...
//    })
