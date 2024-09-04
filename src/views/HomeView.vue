<template>
	<div>Here is the home view</div>
	<RouterLink :to="{ name: store.navigateNext }" @click="goToFirstUI">go to {{ pageLabel }}</RouterLink>
</template>

<script setup>
import { inject, onBeforeMount, computed } from 'vue'
import { onBeforeRouteUpdate } from 'vue-router'
const store = inject('mainStore')


onBeforeMount(() => {
	//console.log(`${store.currentDs.name} ${store.currentDsNa}` ) 



})

const pageLabel = computed(() => {
	const rawName = store.navigateNext
	return rawName?.split("-")[0] ?? "next page"
})

function goToFirstUI() {
	console.log("goto first UI")
	store.consumePage();
}




onBeforeRouteUpdate(async (to, from) => {
	// react to route changes...
	console("on before route update");

})
</script>