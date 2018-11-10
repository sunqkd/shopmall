// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import  VueLazyLoad from 'vue-lazyload'
import Vuex from 'vuex';
import infiniteScroll from 'vue-infinite-scroll';

Vue.use(infiniteScroll);

Vue.use(VueLazyLoad,{
	loading: "/static/loading-svg/loading-balls.svg"
});

Vue.use(Vuex);

const store = new Vuex.Store({
	state:{
		nickName:'',
		cartCount:0
	},
	mutations:{
		updateUserInfo(state,nickName){
			state.nickName = nickName
		},
		updateCartCount(state,cartCount){
			state.cartCount += cartCount
		}
	}
})

Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
	el: '#app',
	router,
	store,
	components: {
		App
	},
	template: '<App/>'
})

// 也可以  .$mount("#app");  代替 el:'#app'