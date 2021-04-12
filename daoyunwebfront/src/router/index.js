import Vue from 'vue'
import Router from 'vue-router'
import { getToken } from '@/utils/auth'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/Login',
      component: () => import('../views/Login.vue'),
      meta: { title: '登录' }
    },
    {
      path: '/Login2',
      component: () => import('../views/Login2.vue'),
      meta: { title: '登录' }
    },
    {
      path: '/ForgetPassword',
      component: () => import('../views/ForgetPassword.vue'),
      meta: { title: '忘记密码' }
    },
    {
      path: '/ForgetPassword2',
      component: () => import('../views/ForgetPassword2.vue'),
      meta: { title: '忘记密码' }
    },
    {
      path: '/Register',
      component: () => import('../views/Register.vue'),
      meta: { title: '注册' }
    },
    {
      path: '/Register2',
      component: () => import('../views/Register2.vue'),
      meta: { title: '注册' }
    },
    // {
    //   path: '/',
    //   redirect: '/Welcome'
    // },
    {
      path: '/Home',
      component: () => import('../views/Home.vue'),
      meta: { title: '主页' },
      children: [
        {
          path: '/Welcome',
          component: () => import('../views/Welcome.vue'),
          meta: { title: '系统首页' }
        },
        {
          path: '/UserManage',
          component: () => import('../views/UserManage.vue'),
          meta: { title: '用户管理' }
        },
        {
          path: '/DictManage',
          component: () => import('../views/DictManage.vue'),
          meta: { title: '字典管理' }
        },
        {
          path: '/DictDataManage',
          component: () => import('../views/DictDataManage.vue'),
          meta: { title: '字典数据' }
        },
        {
          path: '/ParameterManage',
          component: () => import('../views/ParameterManage.vue'),
          meta: { title: '参数管理' }
        },
        {
          path: '/form',
          component: () => import('../views/UseForm.vue'),
          meta: { title: '使用编辑样例' }
        },
        {
          path: '/403',
          component: () => import('../components/403.vue'),
          meta: { title: '403' }
        },
        {
          path: '/404',
          component: () => import('../components/404.vue'),
          meta: { title: '404' }
        },
        {
          path: '/500',
          component: () => import('../components/500.vue'),
          meta: { title: '500' }
        },
        {
          path: '/myError',
          component: () => import('../components/myError.vue'),
          meta: { title: '自定义异常' }
        },
      ]
    },
  ]
})

//挂载路由导航守卫
// router.beforeEach((to, from, next) => {
//   if (to.path === '/Login2') return next();
//   //获取token
//   const tokenStr = getToken()
//   if (!tokenStr) return next('/Login2')
//   next()
// })


export default router
