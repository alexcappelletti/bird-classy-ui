<template>
	<div class="survey-page">
		<p v-if="!showNext" class="display-small ma-4">Survey Step</p>
		<v-btn :active="!showNext" v-if="!showNext" active-color="green-darken-4" class="ma-4" :href="link"
			target="_blank" @click="showNext = true">Press here to open the Survey</v-btn>
		<RouterLink class="ma-4" v-if="showNext" :to="{name: store.navigateNext}" @click="nextUI"><v-btn active
				active-color="green-darken-4">{{ pageLabel }}</v-btn></RouterLink>
	</div>
</template>

<script setup>
import { inject, onBeforeMount, computed, ref } from 'vue'
const store = inject('mainStore')

const link = computed(() => store.surveyLink + store.user)
const showNext = ref(false)

const pageLabel = computed(() => {
	const rawName = store.navigateNext
	if (rawName.includes("results")) {return "show results"}
	//return rawName?.split("-")[0] ?? "next page"
	return "open UI version 2"
})

onBeforeMount(() => {
	//console.log(`${store.currentDs.name} ${store.currentDsNa}` ) 

})




function nextUI() {
	console.log("cset new store content")
	store.consumePage()
}
</script>