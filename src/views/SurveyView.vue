<template>
	<div class="survey-page">
		<p v-if="!showNext || compareSurvey" class="display-small ma-4">Survey Step</p>

		<v-btn :active="!showNext" v-if="!showNext" active-color="green-darken-4" class="ma-4" :href="link"
			target="_blank" @click="showNextFun()">Press here to open the Survey</v-btn>

		<v-btn :active="compareSurvey" v-if="compareSurvey" active-color="green-darken-4" class="ma-4" :href="compSurveyLink"
			target="_blank" @click="compareSurvey = false">Press here to open comparative Survey</v-btn>

		<RouterLink class="ma-4" v-if="showNext && !compareSurvey" :to="{name: store.navigateNext}" @click="nextUI"><v-btn active
				active-color="green-darken-4">{{ pageLabel }}</v-btn></RouterLink>
	</div>
</template>

<script setup>
import { inject, onBeforeMount, computed, ref, onMounted } from 'vue'
import { traceLog } from '@/services/logToMongoDBAtlas';

const store = inject('mainStore')

const link = computed(() => store.surveyLink + store.user)
const showNext = ref(false)

const compareSurvey = ref(false)
const compSurveyLink = "https://docs.google.com/forms/d/e/1FAIpQLScMiSV_sckR6c3bYb5CYTSbK_WD1YBFgDenrUbF-Z8GtBOZIA/viewform?usp=pp_url&entry.690602845=" + store.user


const pageLabel = computed(() => {
	const rawName = store.navigateNext
	if (rawName.includes("results")) {return "show results"}
	//return rawName?.split("-")[0] ?? "next page"
	
	return "open UI version 2"
})

onBeforeMount(() => {
	//console.log(`${store.currentDs.name} ${store.currentDsNa}` ) 

})
onMounted(async() =>{
	try {
		await traceLog({
			event: "show-survey-link",
			params: {
				datasetName: store.currentDs.name,
				interface: store.currentUI
			},
			timestamp: new Date(),
			userID: store.user
		})
	}
	catch (err) { }
})

function showNextFun(){
	showNext.value = true
	if(store.surveyLinks.length == 1)
		compareSurvey.value = true

	console.log(store.surveyLinks.length)
}

async function nextUI() {
	console.log("cset new store content")
	store.consumePage()
	store.consumeLink()
	
	try {
		if (store.currentDs?.tasks === undefined || store.currentTask === undefined) { return; }
	}
	catch (error) { console.error(error) }
}
</script>