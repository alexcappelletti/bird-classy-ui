<template>
	<div>Here is the survey view</div>
	<div>{{ store.linkToSurvey }}</div>
	<RouterLink :to="{name: store.navigateNext}" @click="nextUI">go to {{ pageLabel }}</RouterLink>
</template>

<script setup>
import { inject, onBeforeMount, computed } from 'vue'
const store = inject('mainStore')



const pageLabel = computed(() => {
	const rawName = store.navigateNext
	return rawName?.split("-")[0] ?? "next page"
})

onBeforeMount(() => {
	//console.log(`${store.currentDs.name} ${store.currentDsNa}` ) 

})




function nextUI() {
	console.log("cset new store content")
	
}
</script>