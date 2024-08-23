<template>
	<v-app>
		<NavBar />
		<v-main>
			<router-view></router-view>
		</v-main>
	</v-app>
</template>

<script setup>
import { onMounted, ref, watch } from "vue"

//import NavBar from './components/NavBar.vue';
import NavBar from './components/NavbarFlex.vue'
import HomeView from './views/HomeView.vue'


onMounted(async () => {
	//await login();
	console.log("mounted App")


});
</script>
