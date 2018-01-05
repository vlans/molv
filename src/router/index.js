import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/index'
import Details from '@/components/order/details'
import Success from '@/components/order/success'
import Order from '@/components/order/order'
import Pagination from '@/common/pagination'
import Custom from '@/components/custom'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index
    },
    {
      path: '/details/:id',
      name: 'Details',
      component: Details
    },
    {
      path: '/payment/:id',
      name: 'Payment',
      component: Success
    },
    {
      path: '/order',
      name: 'Order',
      component: Order
    },
    {
      path: '/pagination',
      name: 'Pagination',
      component: Pagination
    },
    {
      path: '/custom',
      name: 'custom',
      component: Custom
    }
  ]
})
