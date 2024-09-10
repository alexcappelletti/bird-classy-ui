<template>
	<div class="navbar" :class="{training:isTraining}">
		<div class="navbar-elems">
			<v-btn v-if=!mainStore.help width=130px color="OnSurfaceVariant" rounded="pill" text="How to use"
				variant="outlined" :disabled="!(storeI.startSet || storeO.startSet)"
				@click="mainStore.showHelp(); logDBSwitchToHelp();"></v-btn>
			<v-btn v-else width=130px color="OnSurfaceVariant" rounded="pill" text="Go to Task" variant="outlined"
				:disabled="!(storeI.startSet || storeO.startSet)"
				@click="mainStore.hideHelp(); logDBSwitchToTask();"></v-btn>
			<v-spacer></v-spacer>
			<p class="display-small" style="color: #404943;">
				Bird Classification {{ versionLabel }} {{trainingLabel}}
			</p>
			
			<v-spacer></v-spacer>
			<!--<div id='pgbar' class="progressbar"></div>-->
			<div id="timerDiv">
				<p id="timerNum" class="body-medium">60s</p>
				<div id="bgBar" style="min-width: 100px; background-color: gray; height: 5px; border-radius: 5px;">
					<div id="timerBar" style="width: 0px; height: 5px; background-color: #19ff85; border-radius: 5px;">
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import {computed, ref , watch} from 'vue'
import { interactionStore, oracleStore } from '@/store/iStore.js'
import { useMainStore } from '@/services/mainStore';
const storeI = interactionStore()
const storeO = oracleStore()
const mainStore = useMainStore()

const versionLabelRef = ref("");


const isTraining = computed(() => mainStore.isTrainingTask)
const trainingLabel = computed(() => mainStore.isTrainingTask? "training": "")
const versionLabel = computed(() => {
	const length = mainStore.pages.length
	if (length >= 1  && length <3) { return "n° 1" }
	if (length >= 3 && length  < 5) { return  "n° 2" }
	return ""
})


function updateLabel(){
	// const length = mainStore.$state.navigationPreset?.length();
	// if (length <= 5 && lenght > 3) { versionLabelRef.value = "ver. #1" }
	// if (length <= 3 && lenght > 1) { versionLabelRef.value = "ver. #2" }
	// versionLabelRef.value = ""
	// // const idx = mainStore.exprContext.uiList?.indexOf(mainStore.currentUI)
	// if (idx === 0) { versionLabelRef.value =  "ver. #1" }
	// else if (idx === 1) { versionLabelRef.value = "ver. #2" }
	// else { versionLabelRef.value= "" }
}

watch(
	() => mainStore.page,
	(newVal, oldV) =>{
		console.log("updating navigationPreset")
		updateLabel()
	}
)


</script>


<style lang="css">

.training{
	background-color: rgb(235, 226, 173);


}

</style>