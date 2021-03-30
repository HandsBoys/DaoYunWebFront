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
          path: '/table',
          component: () => import('../views/UseTable.vue'),
          meta: { title: '使用表格样例' }
        },
        {
          path: '/form',
          component: () => import('../views/UseForm.vue'),
          meta: { title: '使用编辑样例' }
        },
      ]
    },
  ]
})
