import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Register from '@/components/Register'
import ForgotPass from '@/components/ForgotPass'

import Login2 from '@/components/Login2'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
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
  ]
})
