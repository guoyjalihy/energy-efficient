import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// import axios from 'axios'

Vue.config.productionTip = false
// Vue.prototype.$axios = axios
// axios.defaults.headers.post['Content-Type'] = 'application/json'

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
