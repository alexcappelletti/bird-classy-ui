<template>
    <div v-if="!mainStore.help" class="oracle-container">

        <div class="oracle-prediction">

            <div class="oracle-target">
                <h2 class="headline-large">Target Image</h2>
                <v-img style="border-radius: 10px;" height="250" width="250" :src="targetImage"
                    alt="Picture of a small bird" aspect-ratio="1/1"></v-img>
            </div>

            <div class="oracle-results">
                <h2 class="headline-large oracle-results-title">Model Suggestion</h2> 

                <div class="oracle-species-confidence">
                    <h2 class="headline-small">Predicted Species</h2>
                    <h2 class="title-large">{{ mainStore.currentTask.species[store.speciesVisualized].speciesName }}
                    </h2>
                </div>

                <div class="oracle-species-confidence">
                    <h2 class="headline-small">Confidence of the AI <br> tool for prediction</h2>
                    <div class="oracle-confidence">
                        <p class="body-large" >{{ mainStore.currentTask.species[store.speciesVisualized].confidence }} / 100</p>

                        <v-progress-linear id="progressbar" bg-opacity="0.3"
                        :model-value="mainStore.currentTask.species[store.speciesVisualized].confidence"
                        :color="barColor(mainStore.currentTask.species[store.speciesVisualized].confidence / 100)"
                        rounded rounded-bar height="20px" style="width: 100px;"></v-progress-linear>

                    </div>
                    
                </div>

                <div class="oracle-wiki-container">
                    <div>
                        <v-img 
                        class="rounded-lg"
                        :src="mainStore?.currentTask?.species[store.speciesVisualized].wikipic" 
                        :width="175"                        
                        >

                        </v-img>

                    </div>
                    <div class="oracle-wiki-text mx-8 py-2 px-4" style="background-color: #AFCEBC;">
                        <p class="oracle-wiki-description body-large" style="color:#000000;  max-width: 300px;"> {{
                            mainStore.currentTask.species[store.speciesVisualized].description.substr(0,300) }}...
                            <a class='wikilink' @click="openWikiLink()"
                                :href="mainStore.currentTask.species[store.speciesVisualized].wikiLink"
                                target='_blank'>Wikipedia</a>
                        </p>
                    </div>
                </div>

                <div class="oracle-species-confidence">

                    <v-btn color="Primary" rounded="pill" text="Confirm Prediction" height="2.5rem"
                        @click="confirmSelection()"></v-btn>

                    <div class="oracle-right-navigation">
                        <v-btn :class="{ invisible: !allowPrevious() }" color="Primary" rounded="pill" text="<" base-color="#FFFFFF" height="2.5rem"
                        variant="outlined" elevation="0" @click="store.prevSpecies(); switchSpeciesLog()" ></v-btn>
                        
                        <v-btn v-if="!noMorePredictions" color="Primary" rounded="pill" text="Other prediction" base-color="#FFFFFF" height="2.5rem"
                            variant="outlined" elevation="0" @click="store.nextSpecies(); seenAllSpecies(); switchSpeciesLog()"></v-btn>

                        <v-btn v-if="noMorePredictions" :class="{ invisible: !allowNext() }" color="Primary" rounded="pill" text=">" base-color="#FFFFFF" height="2.5rem"
                            variant="outlined" elevation="0" @click="store.nextSpecies(); switchSpeciesLog()" ></v-btn>
                    </div>
                </div>

            </div>

        </div>

    </div>

    <div v-else style="display: flex; flex-direction: column; align-items: center;">

        <div class="interaction-help-page" style="max-width: 900px;">
            <h2 class="headline-large">Interface Description</h2>
            <img style="max-width: 900px; border: 2px solid black;" src="/src/assets/tutorialOracle.png">
            
            <h2 class="headline-medium">Notes</h2>
            <p class="body-large" style="margin-bottom: -15px;">
                There will be 3 predictions per task, after which they will rotate. The order of the predictions will be from the 
                one with the highest confidence, to the one with the lowest one.
            </p>
            <h2 class="headline-medium">Scores</h2>
            <p class="body-large" style="margin-bottom: -15px;">
                Your performance will be ranked in one of three tiers based on your time and correctness of your decisions:
            </p>
            <ul style="padding-left: 20px;" class="body-large">
                <li>Professional Birdwatcher</li>
                <li>Amateur Birdwatcher</li>
                <li>Novice Birdwatcher</li>
            </ul>
        </div>
        <div
            style="display: flex; flex-direction: row; justify-content: center; margin-top: -2rem; margin-bottom: 5rem;">
            <v-btn rounded="pill" color="Primary" @click="startTask()">
                {{ btnHelpPageText }}
            </v-btn>
        </div>

    </div>

</template>

<script setup>
import { onBeforeMount, onMounted, computed, watch, ref } from 'vue';
import { oracleStore } from '@/store/iStore.js'
import { useMainStore } from '@/services/mainStore';
import { traceLog } from '@/services/logToMongoDBAtlas';
import { useRouter } from 'vue-router';
import { timerStore } from '@/store/timerStore';

const store = oracleStore()
const mainStore = useMainStore()
const timerSt = timerStore()
const router = useRouter()

const btnHelpPageText = ref("To the Tutorial")
const noMorePredictions = ref(false)

function allowPrevious(){
    if(store.speciesVisualized > 0)
        return true
    return false
}

function allowNext(){
    if(store.speciesVisualized < 2)
        return true
    return false
}

function seenAllSpecies(){
    if(store.speciesVisualized == 2)
        noMorePredictions.value = true
}

onMounted(async () => {
	try {
		await traceLog({
			event: "start-oracle-ui",
			params: {
				datasetName: mainStore.currentDs.name,
			},
			timestamp: new Date(),
			userID: mainStore.user
		})
		await traceLog({
			event: "show-help-page",
			params: {
				interface: "oracle"
			},
			timestamp: new Date(),
			userID: mainStore.user
		})
	}
	catch (err) { }
})

function barColor(percentage) {
    let c1 = 255 - ((255 - 30) * percentage) + 30
    let c2 = 30 + (190 * percentage)
    return "rgb(" + c1 + "," + c2 + ",0)";
}

const targetImage = computed(()=>{
	const src = `${import.meta.env.VITE_BASE_URL}${mainStore.currentTask?.targetImage}`
	return src
})

async function startTask() {
	try {
		if (mainStore.currentDs?.tasks === undefined || mainStore.currentTask === undefined) { return; }
		store.setStart(new Date())
		mainStore.hideHelp();
        scroll(0,0)
		await traceLog({
			event: "hide-help-page",
			params: {
				interface: mainStore.currentUI
			},
			timestamp: new Date(),
			userID: mainStore.user
		})
		mainStore.train();
		await traceLog({
			event: "begin-sub-task",
			params: {
				subTaskIdx: mainStore.runTask.length,
				datasetName: mainStore.currentDs.name,
				targetImage: mainStore.currentTask.targetImage,
				correctSpeciesName: mainStore.currentTask
					.species[mainStore.currentTask.correctAnswer]
					.speciesName
			},
			timestamp: new Date(),
			userID: mainStore.user
		})
	}
	catch (error) { console.error(JSON.stringify(error)) }
}

async function switchSpeciesLog(){
    if (mainStore.currentDs?.tasks === undefined || mainStore.currentTask === undefined) {return;}
	try {
		await traceLog(
			{
				event: "switch-species" ,
				params: {
					taskIdx: mainStore.runTask.length,
					species: mainStore.currentTask.species[store.speciesVisualized].speciesName,
				},
				timestamp: new Date(),
				userID: mainStore.user
			})
	}
	catch (error){console.error(JSON.stringify(error))}
}

async function confirmSelection(){
    try {
		const currentTask = mainStore.currentTask ?? null
		const rightResponse =
			currentTask.species[store.speciesVisualized].speciesName ===
			currentTask.species[currentTask.correctAnswer].speciesName
		await traceLog({
			event: "confirm-selection-end-task",
			params: {
				species: mainStore.currentTask?.species[store.speciesVisualized]?.speciesName,
				taskIdx: mainStore.runTask.length,
				isRightChoice: rightResponse
			},
			timestamp: new Date(),
			userID: mainStore.user
		})
        store.addCurrentTime(new Date()); 
        store.addAnswer(); 
		const oldUI = mainStore.currentUI;
        store.nextTask(); 
        scroll(0,0)
        if(mainStore.runTask.length > 1)
            btnHelpPageText.value = "To the Task"
		if (oldUI === mainStore.currentUI) {
			await traceLog({
				event: "begin-sub-task",
				params: {
					subTaskIdx: mainStore.runTask.length,
					datasetName: mainStore.currentDs.name,
					targetImage: mainStore.currentTask.targetImage,
					correctSpeciesName: mainStore.currentTask
						.species[mainStore.currentTask.correctAnswer]
						.speciesName
				},
				timestamp: new Date(),
				userID: mainStore.user
			})
		}
        //mainStore.nextTask(); //moved into store.nextTask(), to handle timeout (when the user runs out of time)
    }
	catch (err) { console.error(err) }

}

async function openWikiLink(){
    store.addWikiClick();
    try {
		if (mainStore.currentDs?.tasks === undefined || mainStore.currentTask === undefined) { return; }
		await traceLog({
			event: "open-wikilink-oracle-ui",
			params: {
				taskIdx: mainStore.runTask.length,
				species: mainStore.currentTask.species[store.speciesVisualized].speciesName
			},
			timestamp: new Date(),
			userID: mainStore.user
		})
	}
	catch (error) {
		console.error(error)
	}
}

watch(
	() => mainStore.currentUI,
	async (newV, old) => {
		try {
			await traceLog({
				event: "complete-oracle-ui",
				params: {
					species: mainStore.currentTask?.species[store.cardNumber]?.speciesName,
					taskIdx: mainStore.currentDs?.tasks?.indexOf(mainStore.currentTask),
					datasetName: mainStore.currentDs?.name
				},
				timestamp: new Date(),
				userID: mainStore.user
			})
			const nextPage = mainStore.navigateNext
			console.log(`hasNext ${newV} <- ${old}; navigateNext ${nextPage} `)
			console.log("updating navigation to " + nextPage)
			mainStore.consumePage()
			router.push({ name: nextPage })
		}catch (err){console.log(err)}

	})

</script>

<style>
.invisible{
    visibility: hidden;
}
</style>