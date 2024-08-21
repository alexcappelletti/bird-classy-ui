/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'
import InteractionPage from './InteractionPage.vue'

// Composables
import { createApp } from 'vue'
import { createPinia } from 'pinia'

const app = createApp(App)
const interaction = createApp(InteractionPage)
const pinia = createPinia()


registerPlugins(app)
registerPlugins(interaction)

app.use(pinia)
app.mount('#oracle')

interaction.use(pinia)
interaction.mount('#interaction')
