// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueLazyload from 'vue-lazyload'
import infiniteScroll from 'vue-infinite-scroll'
import {currency} from './util/currency'
import Vuex from 'vuex'

Vue.use(VueLazyload,{
  loading:"/static/loading-svg/loading-bars.svg"
});

Vue.use(infiniteScroll);

Vue.use(Vuex);

const store = new Vuex.Store({
    state:{
        nickName:'',
        cartCount:0
    },
    mutations:{
        updateUserInfo(state,nickName){
            state.nickName = nickName;
        },
        updateCartCount(state,cartCount){
            state.cartCount += cartCount;
        },
        initCartCount(state,cartCount){
            state.cartCount = cartCount;
        }
    }
});

// 全局价格过滤器

Vue.filter('currency',currency);

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
