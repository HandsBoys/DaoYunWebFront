import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/Login2',
      component: () => import('../views/Login2.vue'),
      meta: { title: '登录' }
    },
    {
      path: '/ForgetPassword2',
      component: () => import('../views/ForgetPassword2.vue'),
      meta: { title: '忘记密码' }
    },
    {
      path: '/Register2',
      component: () => import('../views/Register2.vue'),
      meta: { title: '注册' }
    },
    {
      path: '/',
      redirect: '/Login2'
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
          path: '/RoleManage',
          component: () => import('../views/RoleManage.vue'),
          meta: { title: '角色管理' }
        },
        {
          path: '/MenuManage',
          component: () => import('../views/MenuManage.vue'),
          meta: { title: '菜单管理' }
        },
        {
          path: '/CourseManage',
          component: () => import('../views/CourseManage.vue'),
          meta: { title: '班课管理' }
        },
        {
          path: '/CourseStudentManage',
          component: () => import('../views/CourseStudentManage.vue'),
          meta: { title: '班课学生管理' }
        },
        {
          path: '/InstitutionManage',
          component: () => import('../views/InstitutionManage.vue'),
          meta: { title: '机构管理' }
        },
        {
          path: '/403',
          component: () => import('../components/page403.vue'),
          meta: { title: '403' }
        },
        {
          path: '/404',
          component: () => import('../components/page404.vue'),
          meta: { title: '404' }
        },       
      ]
    },
    {path: '*', redirect: '/404'}
  ]
})


export default router
