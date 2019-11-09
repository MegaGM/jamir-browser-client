import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/auth',
      name: 'auth',
      component: () => import(/* webpackChunkName: "auth" */ './views/Auth.vue')
    },
    {
      path: '/address-programs',
      name: 'address-programs',
      component: () => import(/* webpackChunkName: "address-programs" */ './views/AddressPrograms.vue')
    },
    {
      path: '/check-reports',
      name: 'check-reports',
      component: () => import(/* webpackChunkName: "check-reports" */ './views/CheckReports.vue')
    },
    {
      path: '/exported-reports',
      name: 'exported-reports',
      component: () => import(/* webpackChunkName: "exported-reports" */ './views/ExportedReports.vue')
    },
    {
      path: '/menu',
      name: 'menu',
      component: () => import(/* webpackChunkName: "menu" */ './views/Menu.vue')
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import(/* webpackChunkName: "settings" */ './views/Settings.vue')
    },
    {
      path: '/address-programs',
      name: 'address-programs',
      component: () => import(/* webpackChunkName: "address-programs" */ './views/AddressPrograms.vue')
    },
    {
      path: '/user-management',
      name: 'user-management',
      component: () => import(/* webpackChunkName: "user-management" */ './views/UserManagement.vue')
    },
    {
      path: '/view-reports',
      name: 'view-reports',
      component: () => import(/* webpackChunkName: "view-reports" */ './views/ViewReports.vue')
    },
  ]
})
