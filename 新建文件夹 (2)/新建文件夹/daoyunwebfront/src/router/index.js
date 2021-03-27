import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export const constantRoutes = [
  {
    path: '/login',
    component: (resolve) => require(['@/views/login'], resolve),
    hidden: true
  }
]

export default new Router({
  mode: 'history', // 去掉url中的#
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

// export default new Router({
//   routes: [
//     {
//       path: '/login',
//       component: (resolve) => require(['@/views/login'], resolve),
//       hidden: true
//     }
//   ]
// })
