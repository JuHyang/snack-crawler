// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Es6Promise from 'es6-promise'
Es6Promise.polyfill()
import "babel-polyfill"
import Vue from 'vue'
import App from './App'
import Vuetify from 'vuetify'
import axios from 'axios'
import 'vuetify/dist/vuetify.min.css' // Ensure you are using css-loader
import router from './router'

Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.use(Vuetify)

new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
