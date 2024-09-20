<template>
	<v-responsive class="border rounded" min-height="1200px">
		<v-app>
			<v-app-bar :elevation="2">
				<NavBar />
			</v-app-bar>
			<v-main>
				<router-view></router-view>
			</v-main>
		</v-app>
	</v-responsive>
</template>

<script setup>
import { onMounted, ref, watch } from "vue"

//import NavBar from './components/NavBar.vue';
import NavBar from './components/NavbarFlex.vue'



onMounted(async () => {
	//await login();
	console.log("mounted App")


});
</script>
