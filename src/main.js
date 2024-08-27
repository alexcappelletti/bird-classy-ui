/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Composables
import { createApp } from 'vue'
import { createPinia } from 'pinia'

// Plugins
import { registerPlugins } from '@/plugins'
import { setupRouter } from '@/services/router'
import { useMainStore } from './services/mainStore'
import { oracleStore } from './store/iStore'
// Components
import App from '@/App.vue'


f = async ()=> {
	const app = createApp(App)
	app.config.errorHandler = (err) => {
		console.log(err)
	}
	registerPlugins(app)
	const pinia = createPinia()
	app.use(pinia)
	await oracleStore().load('./ src / assets / info.json')
	app.provide("mainStore", useMainStore());
	//router 
	const router = setupRouter();
	app.use(router)

	app.mount('#app')

}

f()
