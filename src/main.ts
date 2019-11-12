import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import AntD from 'ant-design-vue'
import './styles/index.less'
import SCVue from './plugins/socketcluster-client.plugin'

Vue.use(SCVue)
Vue.config.productionTip = false
Vue.use(AntD)

declare global {
  interface Window {
    $app: Vue
  }
}

window.$app = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
