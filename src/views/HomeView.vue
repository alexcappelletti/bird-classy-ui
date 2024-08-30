<template>
	<div>Here is the home view</div>
	<RouterLink :to="store.nextUI" @click="nextUI">go to {{ store.nextUI }}</RouterLink>
</template>

<script setup>
import { inject, onBeforeMount } from 'vue'
import { onBeforeRouteUpdate } from 'vue-router'
const store = inject('mainStore')


onBeforeMount(()=>{
	//console.log(`${store.currentDs.name} ${store.currentDsNa}` ) 



})
function nextUI() {
	console.log("cset new store content")
	store.nextInContext();
}
onBeforeRouteUpdate(async (to, from) => {
	// react to route changes...
	console("on before route update");
	
})
</script>