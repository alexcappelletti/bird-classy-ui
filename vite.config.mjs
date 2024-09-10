// Plugins
import Components from 'unplugin-vue-components/vite'
import Vue from '@vitejs/plugin-vue'
import Vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
import ViteFonts from 'unplugin-fonts/vite'
import vueDevTools from 'vite-plugin-vue-devtools'
// Utilities
import { defineConfig, loadEnv } from 'vite'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
	// Load env file based on `mode` in the current working directory.
	// Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
	const env = loadEnv(mode, process.cwd(), '')
	return {
		base: env.VITE_BASE_URL,
		plugins: [
			Vue({
				template: { transformAssetUrls }
			}),
			// https://github.com/vuetifyjs/vuetify-loader/tree/master/packages/vite-plugin#readme
			Vuetify(),
			//vueDevTools(),
			Components(),
			ViteFonts({
				google: {
					families: [{
						name: 'Roboto',
						styles: 'wght@100;300;400;500;700;900',
					}],
				},
			}),
		],
		define: {
			//'process.env': {},
			// VITE_BASE_URL: JSON.stringify(env.VITE_BASE_URL),
			// VITE_DS_FILE: JSON.stringify(env.VITE_DS_FILE),
			__VUE_OPTIONS_API__: false,
			__VUE_PROD_DEVTOOLS__: true,

		},
		resolve: {
			alias: {
				'@': fileURLToPath(new URL('./src', import.meta.url))
			},
			extensions: [
				'.js',
				'.json',
				'.jsx',
				'.mjs',
				'.ts',
				'.tsx',
				'.vue',
			],
		},
		server: {
			port: 8002,
			host: '127.0.0.1'
		},
	} //end return 
})
