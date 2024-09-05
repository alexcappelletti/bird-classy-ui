<template>
	<div>Here is the survey view</div>
	<div><a :href="link" target="_blank" @click="showNext = true">survey now!</a></div>
	<RouterLink v-if="showNext" :to="{name: store.navigateNext}" @click="nextUI">go to {{ pageLabel }}</RouterLink>
</template>

<script setup>
import { inject, onBeforeMount, computed, ref } from 'vue'
const store = inject('mainStore')

const link = computed(() => store.surveyLink + store.user)
const showNext = ref(false)
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