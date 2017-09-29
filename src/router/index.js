import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import GoodsList from './../views/GoodsList'
import Cart from '@/views/Cart'
import Address from '@/views/Address'
// import Title from '@/views/Title'
// import Image from '@/views/Image'
// import Cart from '@/views/Cart'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'GoodsList',
      component: GoodsList,
    },
    {
        path: '/cart',
        name: 'Cart',
        component: Cart
    },
    {
        path: '/address',
        name: 'Address',
        component: Address
    }
  ]
})
