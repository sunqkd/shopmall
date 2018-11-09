import Vue from 'vue'
import Router from 'vue-router'
import GoodList from '@/views/goodlist.vue';
Vue.use(Router)

export default new Router({
	// mode:'history', // 路由模式 默认为带个#号 history hash 两种属性

	routes: [{
		// 动态路由
		path: '/',
		name: 'GoodList',
		component: GoodList
	}]
})

