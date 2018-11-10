// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import  VueLazyLoad from 'vue-lazyload'

Vue.config.productionTip = false

import infiniteScroll from 'vue-infinite-scroll'
Vue.use(infiniteScroll);

Vue.use(VueLazyLoad,{
	loading: "/static/loading-svg/loading-balls.svg"
})

/* eslint-disable no-new */
new Vue({
	el: '#app',
	router,
	components: {
		App
	},
	template: '<App/>'
})

// 也可以  .$mount("#app");  代替 el:'#app'