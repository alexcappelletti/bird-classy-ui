import {
	createRouter,
	createWebHistory,
} from 'vue-router'
import { useMainStore } from '@/services/mainStore'

import Oracle from '@/components/OracleInterfaceFlex.vue'
import InteractionInterface from '@/components/InteractionInterface.vue'
import Results from '@/components/Results.vue'
import Home from '@/views/HomeView.vue'
import SurveyView from '@/views/SurveyView.vue'
const BASE_URL = import.meta.env.VITE_BASE_URL ?? '/'
export function setupRouter(){
	const mainStore = useMainStore()
	const routes = [
		{
			name: "home-page",
			path: `${BASE_URL}` ,
			query:{ ctx: ""},
			component: Home,
		},
		{
			name: "oracle-page",
			path: `${BASE_URL}oracle`,
			component: Oracle,
		},// only authenticated users can create posts
		{
			name: "similarity-page",
			path: `${BASE_URL}similarity`,
			component: InteractionInterface,
		},
		{
			name: "results-page",
			path: `${BASE_URL}results`,
			component: Results,
		},
		{
			name: "survey-page",
			path: `${BASE_URL}survey`,
			component: SurveyView,
		},
		
	]
	const router = createRouter({
		history: createWebHistory(import.meta.env.VITE_BASE_URL),
		routes: routes,
		
	})
	router.beforeEach(async (to, from) => {
		try {
			console.log("beforeEach " +to.name)
			const toName = to.name 
			if (toName === "home-page" ) {
				//console.log("setting expr context " + to.query.ctx)
				const exprContext = to.query.ctx ?? "";
				mainStore.setExperimentContext(exprContext)
				await mainStore.loadDatasets()
			}
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