import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import store from './store'
import axios from 'axios'
import 'material-design-icons/iconfont/material-icons.css'
import 'typeface-roboto/index.css'
import vuetify from './plugins/vuetify'
import '@babel/polyfill'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@mdi/font/css/materialdesignicons.css'

Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

new Vue({
  store,
  vuetify,
  render: h => h(App),
}).$mount('#app')
