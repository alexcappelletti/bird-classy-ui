import {
	createRouter,
	createWebHistory,
} from 'vue-router'
import { useMainStore } from '@/services/mainStore'

import Oracle from '@/components/OracleInterfaceFlex.vue'
import InteractionInterface from '@/components/InteractionInterface.vue'
import Results from '@/components/Results.vue'
import Home from '@/views/HomeView.vue'

export function setupRouter(){
	const mainStore = useMainStore()
	const routes = [
		{
			name: "home-page",
			path: '/' ,
			query:{ ctx: ""},
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
		{
			name: "results-page",
			path: '/results',
			component: Results,
		},
	]
	const router = createRouter({
		history: createWebHistory(import.meta.env.VITE_BASE_URL),
		routes: routes
	})
	router.beforeEach(async (to, from) => {
		try {
			console.log("beforeEach " +to.name)
			const toName = to.name ?? "home-page"
			if (toName === "home-page" ) {
				console.log("setting expr context " + to.query.ctx)
				const exprContext = to.query.ctx ?? "";
				mainStore.setExperimentContext(exprContext)
				await mainStore.loadDatasets()
			}
			else if (toName === "oracle-page") {mainStore.firstUI = mainStore.secondUI}
			

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