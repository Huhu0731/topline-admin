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

    // 处理一个警告问题
    // [vue-router] Named Route 'layout' has a default child route. When navigating to this named route
    // (:to="{name: 'layout'"), the default child route will not be rendered. Remove the name from this
    // route and use the name of the default child route for named links instead.
    {
      // name: 'layout', // 这个名字是没有意义的
      path: '/',
      component: () => import('@/views/layout'),
      children: [
        {
          name: 'home',
          path: '',
          component: () => import('@/views/home')
        },
        { // 文章列表
          name: 'article-list',
          path: '/article',
          component: () => import('@/views/article')
        },
        { // 发布文章
          name: 'publish',
          path: '/publish',
          component: () => import('@/views/publish')
        },
        { // 编辑文章
          name: 'publish-edit',
          path: '/publish/:id',
          component: () => import('@/views/publish')
        },
        { // 评论管理
          name: 'article-comment',
          path: '/comment',
          component: () => import('@/views/comment')
        },
        { // 账户设置
          name: 'account-setting',
          path: '/account',
          component: () => import('@/views/account')
        },
        { // 用户图片素材
          name: 'image',
          path: '/image',
          component: () => import('@/views/image')
        },
        { // 粉丝概况
          name: 'fans-overview',
          path: '/fans/overview',
          component: () => import('@/views/fans')
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
