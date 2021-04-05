import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/Login',
      component: () => import('../views/Login.vue'),
      meta: { title: '登录' }
    },
    {
      path: '/ForgetPassword',
      component: () => import('../views/ForgetPassword.vue'),
      meta: { title: '忘记密码' }
    },
    {
      path: '/Register',
      component: () => import('../views/Register.vue'),
      meta: { title: '注册' }
    },
    {
      path: '/',
      redirect: '/Welcome'
    },
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
