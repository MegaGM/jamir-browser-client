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
      name: 'Меню',
      component: () => import(/* webpackChunkName: "menu" */ './views/Menu.vue')
    },
    {
      path: '/auth',
      name: 'Авторизация',
      component: () => import(/* webpackChunkName: "auth" */ './views/Auth.vue')
    },
    {
      path: '/address-programs',
      name: 'Адресные Программы',
      component: () => import(/* webpackChunkName: "address-programs" */ './views/AddressPrograms.vue')
    },
    {
      path: '/check-reports',
      name: 'Проверка Отчётов',
      component: () => import(/* webpackChunkName: "check-reports" */ './views/CheckReports.vue')
    },
    {
      path: '/view-reports',
      name: 'Просмотр Отчётов',
      component: () => import(/* webpackChunkName: "view-reports" */ './views/ViewReports.vue')
    },
    {
      path: '/exported-reports',
      name: 'Экспортированные выборки',
      component: () => import(/* webpackChunkName: "exported-reports" */ './views/ExportedReports.vue')
    },
    {
      path: '/user-management',
      name: 'Управление пользователями',
      component: () => import(/* webpackChunkName: "user-management" */ './views/UserManagement.vue')
    },
    {
      path: '/settings',
      name: 'Настройки',
      component: () => import(/* webpackChunkName: "settings" */ './views/Settings.vue')
    },
    {
      path: '/upload-report',
      name: 'Загрузить отчёт',
      component: () => import(/* webpackChunkName: "settings" */ './views/UploadReport.vue')
    },
  ]
})
