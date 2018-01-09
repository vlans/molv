import Vue from 'vue'
import App from './App'
import router from './router'
import $ from 'jquery'

import iView from 'iview'
import 'iview/dist/styles/iview.css'

import 'normalize.css'

import 'vue-awesome/icons'

import Icon from 'vue-awesome/components/Icon'

Vue.use(iView)

Vue.prototype.$http = $.ajax

Vue.component('icon', Icon)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
