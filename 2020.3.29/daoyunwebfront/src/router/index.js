import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Register from '@/components/Register'
import ForgotPass from '@/components/ForgotPass'
import index from '@/components/index'

import Login2 from '@/components/Login2'

Vue.use(Router)

export default new Router({
  mode:'hash',  //部署修改
  routes: [
    { path: '/', redirect: '/Login' }
    ,
    {
      path: '/Login',
      name: 'Login',
      component: Login
    },
    {
      path: '/Register',
      name: 'Register',
      component: Register
    },
    {
      path: '/ForgotPass',
      name: 'ForgotPass',
      component: ForgotPass
    },
    {
      path: '/Login2',
      name: 'Login2',
      component: Login2
    },
    {
      path: '/index',
      component: index,
      redirect: '/welcome',
      children: [
          { path: '/welcome', component: Welcome },
      ]
  }
  ]
})
