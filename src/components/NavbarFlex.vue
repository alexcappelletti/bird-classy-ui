<template>
	<div class="navbar" :class="{training:isTraining}">
		<div class="navbar-elems">
			<v-btn v-if=!mainStore.help width=130px color="OnSurfaceVariant" rounded="pill" text="How to use"
				variant="outlined" :disabled="!(storeI.startSet || storeO.startSet)"
				@click="logDBSwitchToHelp();"></v-btn>
			<v-btn v-else width=130px color="OnSurfaceVariant" rounded="pill" text="Go to Task" variant="outlined"
				:disabled="!(storeI.startSet || storeO.startSet)"
				@click="logDBSwitchToTask();"></v-btn>
			<v-spacer></v-spacer>
			<p class="display-small text-h3" style="color: #404943;">
				Bird Classification
			</p>
			<p class="subhead text-h6">{{ versionLabel }}</p>

			<v-spacer></v-spacer>
			<!--<div id='pgbar' class="progressbar"></div>-->
			<!--<div id="timerDiv">
				<p id="timerNum" class="body-medium">60s</p>
				<div id="bgBar" style="min-width: 100px; background-color: gray; height: 5px; border-radius: 5px;">
					<div id="timerBar" style="width: 0px; height: 5px; background-color: #19ff85; border-radius: 5px;">
					</div>
				</div>
			</div>-->
			<div>
				<p class="body-large">Timer</p>
				<p class="body-large" id="stopwatch">00:00</p>
			</div>
		</div>
	</div>
</template>

<script setup>
import {computed, ref , watch} from 'vue'
import { interactionStore, oracleStore } from '@/store/iStore.js'
import { useMainStore } from '@/services/mainStore';
import { traceLog } from '@/services/logToMongoDBAtlas';
import { timerStore } from '@/store/timerStore';

const storeI = interactionStore()
const storeO = oracleStore()
const mainStore = useMainStore()

const versionLabelRef = ref("");


const isTraining = computed(() => mainStore.isTrainingTask)
const trainingLabel = computed(() => mainStore.isTrainingTask? "- training": "")
const versionLabel = computed(() => {
	const length = mainStore.pages.length
	let label = ""
	if (length >= 1  && length <3) {
		label = "[version 1"
		if (mainStore.isTrainingTask) {label += (" - training")}
		label += "]"
	}
	else if (length >= 3 && length  < 5) { 
		label = "[version 2"
		if (mainStore.isTrainingTask) { label += (" - training") }
		label += "]"
		
	}
	return label
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

async function logDBSwitchToHelp(){
	mainStore.showHelp(); 
	try {
		if (mainStore.currentDs?.tasks === undefined || mainStore.currentTask === undefined) { return; }
		await traceLog({
			event: "switchToHelp",
			params: {
				taskIdx: mainStore.runTask.length,
				interface: mainStore.currentUI
			},
			timestamp: new Date(),
			userID: mainStore.user
		})
	}
	catch (error) { console.error(error) }
}

async function logDBSwitchToTask(){
	mainStore.hideHelp(); 
	try {
		if (mainStore.currentDs?.tasks === undefined || mainStore.currentTask === undefined) { return; }
		await traceLog({
			event: "switchToTask",
			params: {
				taskIdx: mainStore.runTask.length,
				interface: mainStore.currentUI
			},
			timestamp: new Date(),
			userID: mainStore.user
		})
	}
	catch (error) { console.error(error) }
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
.subhead {
	margin-left: 10px;
	margin-top:10px;

}

</style>