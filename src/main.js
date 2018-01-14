import Vue from 'vue'
import App from './App'
import router from './router'
import $ from 'jquery'

import 'normalize.css'
import iView from 'iview'
import 'iview/dist/styles/iview.css'

Vue.use(iView)

Vue.prototype.$http = $.ajax


Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
