<template>
	<div class="home-page">
		<p class="display-small ma-4">Home Page</p>
		<RouterLink :to="{ name: store.navigateNext }" @click="goToFirstUI"><v-btn active active-color="green-darken-4">{{ pageLabel }}</v-btn></RouterLink>
	</div>
</template>

<script setup>
import { inject, onBeforeMount, computed } from 'vue'
import { onBeforeRouteUpdate } from 'vue-router'
import { traceLog } from '@/services/logToMongoDBAtlas';

const store = inject('mainStore')


onBeforeMount(() => {
	//console.log(`${store.currentDs.name} ${store.currentDsNa}` ) 



})

const pageLabel = computed(() => {
	const rawName = store.navigateNext
	//return rawName?.split("-")[0] ?? "next page"
	return "Go to UI version 1"
})

async function goToFirstUI() {
	console.log("goto first UI")
	store.consumePage();
	try {
		if (store.currentDs?.tasks === undefined || store.currentTask === undefined) { return; }
	
	}
	catch (error) { console.error(error) }
}




onBeforeRouteUpdate(async (to, from) => {
	// react to route changes...
	console("on before route update");

})
</script>