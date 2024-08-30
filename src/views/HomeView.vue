<template>
	<div>Here is the home view</div>
	<RouterLink :to="store.nextUI">go to {{ store.nextUI }}</RouterLink>
</template>

<script setup>
import { inject, onBeforeMount } from 'vue'
import { onBeforeRouteUpdate } from 'vue-router'
const store = inject('mainStore')


onBeforeMount(()=>{
	//console.log(`${store.currentDs.name} ${store.currentDsNa}` ) 



})
onBeforeRouteUpdate(async (to, from) => {
	// react to route changes...
	console("on before route update");
	
})
</script>