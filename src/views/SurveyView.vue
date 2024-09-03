<template>
	<div>Here is the survey view</div>
	<div>{{ store.linkToSurvey }}</div>
	<RouterLink :to="store.navigateTo" @click="nextUI">go to {{ store.navigateTo }}</RouterLink>
</template>

<script setup>
import { inject, onBeforeMount, computed } from 'vue'
const store = inject('mainStore')


onBeforeMount(() => {
	//console.log(`${store.currentDs.name} ${store.currentDsNa}` ) 



})
function nextUI() {
	console.log("cset new store content")
	store.nextInContext();
	store.nextInNavigation();

}
</script>