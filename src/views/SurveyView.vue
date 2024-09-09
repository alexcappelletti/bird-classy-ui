<template>
	<div class="survey-page">
		<p class="display-small ma-4">Survey Step</p>
		<v-btn :active="!showNext" active-color="light-blue-darken-4" class="ma-4" :href="link" target="_blank" @click="showNext = true">Press here to open the Survey</v-btn>
		<RouterLink v-if="showNext" :to="{name: store.navigateNext}" @click="nextUI"><v-btn active active-color="light-blue-darken-4">Go to {{ pageLabel }}</v-btn></RouterLink>
	</div>
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
	store.consumePage()
}
</script>