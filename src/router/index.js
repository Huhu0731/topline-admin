import Vue from 'vue'
import Router from 'vue-router'
import NProgress from 'nprogress'

Vue.use(Router)

const router = new Router({
  routes: [
    // {
    //   name: 'home',
    //   path: '/',
    //   component: () => import('@/views/home')
    // },
    {
      name: 'layout',
      path: '/',
      component: () => import('@/views/layout'),
      children: [
        {
          name: 'home',
          path: '',
          component: () => import('@/views/home')
        },
        {
          name: 'article-list',
          path: '/article',
          component: () => import('@/views/article')
        },
        {
          name: 'publish',
          path: '/publish',
          component: () => import('@/views/publish')
        }
      ]
    },
    {
      name: 'login',
      path: '/login',
      component: () => import('@/views/login')
    }
  ]
})

// 路由守卫
/**
 * 所有路由导航都要经过这里
 * to 去哪儿
 * from 来自哪里
 * next 允许通过的方法
 */
router.beforeEach((to, from, next) => {
  NProgress.start()
  // 判断是不是登陆页面
  // 若是 判断是否有登陆信息 有 让其不在访问登陆页面 没有 则可以访问登陆页面
  // 若不是 判断是否有登陆信息 有 让其通过 没有让他去登陆
  const userInfo = window.localStorage.getItem('user_info')
  if (to.path === '/login') {
    if (userInfo) {
      next(false)
    } else {
      next()
    }
  } else {
    if (userInfo) {
      next()
    } else {
      next({ name: 'login' })
    }
  }
})

// 路由加载完毕都会经过这里
router.afterEach((to, from) => {
  NProgress.done()
})

export default router
