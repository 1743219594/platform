import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress 进度条
import 'nprogress/nprogress.css' // progress 进度条样式
import { getToken } from '@/utils/auth' // 验权
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // 不重定向白名单

router.beforeEach(async(to, from, next) => {
  NProgress.start()
  // set page title
  document.title = getPageTitle(to.meta.title)

 if (getToken()) {
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
    } else {
      if (store.getters.roles.length === 0) {
        store.dispatch('GetInfo').then(res => { // 拉取用户信息
          let menus=res.data.menus;
          let username=res.data.username;
          store.dispatch('GenerateRoutes', { menus,username }).then(() => { // 生成可访问的路由表
            const routers = store.getters.addRouters
            router.addRoutes(store.getters.addRouters); // 动态添加可访问路由表
            routers.forEach((item, index) => {
                router.options.routes[index] = item
            })
            next({ ...to, replace: true })
          })
        }).catch((err) => {
          store.dispatch('FedLogOut').then(() => {
            Message.error(err || '验证失败，请重新登录！')
            next({ path: '/' })
          })
        })
      } else {
        next()
      }
    

    //   const hasGetUserInfo = store.getters.name
    //   if (hasGetUserInfo) {
    //     next()
    //   } else {
    //     try {
    //       await store.dispatch('user/getInfo')

    //       next()
    //     } catch (error) {
    //       // remove token and go to login page to re-login
    //       await store.dispatch('user/resetToken')
    //       Message.error(error || 'Has Error')
    //       next(`/login?redirect=${to.path}`)
    //       NProgress.done()
    //     }
    //   }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()  // 结束Progress
})
