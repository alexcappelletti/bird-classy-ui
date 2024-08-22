import {
	createRouter,
	createWebHistory,
} from 'vue-router'


import Oracle from '@/components/OracleInterfaceFlex.vue'
import InteractionInterface from '@/components/InteractionInterface.vue'
import Home from '@/views/HomeView.vue'

export function setupRouter(){
	const routes = [
		{
			name: "home",
			path: '/',
			component: Home,
		},
		{
			name: "oracle-page",
			path: '/oracle',
			component: Oracle,
			props: true,
		},// only authenticated users can create posts
		{
			name: "interactive-page",
			path: "/similarity",
			component: InteractionInterface,
		},
	]
	const router = createRouter({
		history: createWebHistory(import.meta.env.VITE_BASE_URL),
		routes: routes
	})
	router.beforeEach(async (to, from) => {
		try {
			// if (to.meta.requiresAuth && !useAuth().isLoggedIn) {
			// 	return {path: "/", query: {redirect: to.fullPath}}
			// }
			//	if (to.name === "errorPage") {return true}
		}
		catch (err) {
			console.error(err)
			return { name: 'errorPage' }
		}
		return true
	});
	return router
}