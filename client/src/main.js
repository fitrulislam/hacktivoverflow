import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import './registerServiceWorker'
import Vuetify from 'vuetify'

Vue.use(Vuetify)
Vue.config.productionTip = false
Vue.prototype.$http = axios

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
