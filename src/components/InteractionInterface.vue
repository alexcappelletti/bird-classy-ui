<template>
	<div v-if="!isHelpVisible" class="interaction-container" style="margin-top: 5%;">

		<div class="interaction-vertical" style="position: fixed; left: 20%;">
			<p class="headline-large">Image to Identify</p>
			<img :src="targetImage" style="border-radius: 5%;">
		</div>

		<div class="interaction-vertical" style=" position: relative; left: 15%;" v-if="!store.cardOpened">
			<p class="headline-large">Suggested Species</p>

			<div class="interaction-cards">
				<v-card v-for="s in mainStore.currentTask?.species" :key="s.speciesName" width="180" class="rounded-lg"
					hover color="Secondary95" @click="openSpeciesCard(s)">
					<v-img :src="pictureSourceFormat(s, 0, 'best')" cover></v-img>
					<p class="body-large pa-4">{{ s.speciesName }}</p>
				</v-card>
			</div>
		</div>

		<v-fade-transition>
			<div v-show="store.appearInfo"
				style=" position: relative; left: 15%; margin-bottom: 200px; margin-top: -32px;">
				<v-sheet class="align-center justify-center text-center mx-auto py-6" color="Secondary95" elevation="5"
					max-width="800px">

					<div class="zoom-card">
						<!--<v-img class="mx-auto" style="border-radius: 5%;" width="300px"
                            :src="store.getSimilarityPicBest(store.currentTask, store.cardNumber, 0)"></v-img>-->
						<v-img class="mx-auto" style="border-radius: 5%;" width="300px"
							:src="pictureSourceFormat(store.cardNumber, 0, 'best')"></v-img>
						<p class="headline-large">{{ mainStore.currentTask?.species[store.cardNumber]?.speciesName }}
						</p>

						<!--<v-tabs v-model="initialVal" align-tabs="center" color="deep-purple-accent-4">
                            <v-tab v-for="item in itemsPics" :key="item" :text="item" :value="item"></v-tab>
                        </v-tabs>
                        <v-tabs-window v-model="initialVal">
                            <v-tabs-window-item v-for="item in itemsPics" :key="item" :value="item">
                                <v-sheet class="mx-auto" max-width="790" color="Secondary95">
                                    <v-slide-group v-model="model" class="pa-2" show-arrows>
                                        <v-slide-group-item v-for="i in 8" :key="i">

                                            <v-img v-if="item == itemsPics[0]" class="ma-2"
                                                :src="store.getSimilarityPicBest(store.currentTask, store.cardNumber, i)"
                                                height="150px" width="150px" cover></v-img>

                                            <v-img v-if="item == itemsPics[1]" class="ma-2"
                                                :src="store.getSimilarityPicWorst(store.currentTask, store.cardNumber, i - 1)"
                                                height="150px" width="150px" cover></v-img>

                                        </v-slide-group-item>
                                    </v-slide-group>
                                </v-sheet>
                            </v-tabs-window-item>
                        </v-tabs-window>-->


						<v-tabs align-tabs="center" color="deep-purple-accent-4">
							<v-tab style="margin: 0%;" :text="itemsPics[0]" @click="openTabAsync(0, 'Most')"></v-tab>
							<v-tab style="margin: 0%;" :text="itemsPics[1]" @click="openTabAsync(1, 'Least')"></v-tab>
						</v-tabs>

						<v-sheet v-if="idTab == 0" class="mx-auto" style="margin-top: -5px;" max-width="790"
							color="Secondary95">
							<v-slide-group v-model="model" class="pa-2" show-arrows>
								<v-slide-group-item v-for="i in 8" :key="i">

									<v-img class="ma-2" :src="pictureSourceFormat(store.cardNumber, i, 'best')"
										height="150px" width="150px" cover></v-img>

								</v-slide-group-item>
							</v-slide-group>
						</v-sheet>
						<v-sheet v-if="idTab == 1" class="mx-auto" style="margin-top: -5px;" max-width="790"
							color="Secondary95">
							<v-slide-group v-model="model" class="pa-2" show-arrows>
								<v-slide-group-item v-for="i in 8" :key="i">

									<v-img class="ma-2" :src="pictureSourceFormat(store.cardNumber, i - 1, 'worst')"
										height="150px" width="150px" cover></v-img>

								</v-slide-group-item>
							</v-slide-group>
						</v-sheet>


						<div class="mx-8 py-2 px-4" style="background-color: #AFCEBC; border-radius: 20px">
							<p id="description" class="body-large text-justify">
								{{ mainStore.currentTask?.species[store.cardNumber]?.description.substr(0,320) }}.. <a
									class='wikilink' :href="mainStore.currentTask?.species[store.cardNumber]?.wikiLink ?? '#' " target='_blank'
									@click="openWikiLinkAsync(mainStore.currentTask?.species[store.cardNumber])">Wikipedia</a></p>
						</div>

						<div
							style="display: flex; flex-direction: row; justify-content: space-between; min-width: 600px; gap: 10px;">
							<v-btn rounded="pill"
								@click="handleClosePageAsync(mainStore.currentTask?.species[store.cardNumber]);"
								style="flex-grow: 1;">
								Back
							</v-btn>

							<v-btn rounded="pill" color="Primary" style="flex-grow: 2" @click="confirmAsync">
								Confirm
							</v-btn>
						</div>

					</div>
				</v-sheet>
			</div>
		</v-fade-transition>
	</div>

	<div v-else style="display: flex; flex-direction: column; align-items: center">

        <div class="interaction-help-page" style="max-width: 900px;">
            <h2 class="headline-large">Interface Description</h2>
            <img style="max-width: 900px; border: 2px solid black;" src="/src/assets/tutorialSimilarityBase.png">
			<p>By clicking on one of the <b>Suggested Species</b>, like for example, the Blue Coua, the card will expand:</p>
            <img style="max-width: 900px; border: 2px solid black;" src="/src/assets/tutorialSimilarityZoom.png">
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
			<v-btn rounded="pill" color="Primary" @click="startTaskAsync /* logDBSwitchToTask() */">
				{{ btnHelpPageText }}
			</v-btn>
		</div>

	</div>
</template>

<script setup>
import { onBeforeMount, ref, computed, watch, onMounted } from 'vue';
import { interactionStore } from '@/store/iStore.js'
import { useMainStore } from '@/services/mainStore';
import { traceLog } from '@/services/logToMongoDBAtlas';
import { useRouter } from 'vue-router'
import { amber } from 'vuetify/util/colors';
import { timerStore } from '@/store/timerStore';


const store = interactionStore()
const mainStore = useMainStore()
const router = useRouter()
const timerSt = timerStore()


const idTab = ref(0)

const btnHelpPageText = ref("To the Tutorial")


onBeforeMount(() => {
	//get the info on which to load from the link
	//store.loadData('./src/assets/pool', 2);

})
onMounted(async() =>{
	try {
		await traceLog({
			event: "start-similarity-ui",
			params: {
				datasetName: mainStore.currentDs.name,
			},
			timestamp: new Date(),
			userID: mainStore.user
		})
		await traceLog({
			event: "show-help-page",
			params: {
				interface: "similarity"
			},
			timestamp: new Date(),
			userID: mainStore.user
		})
		

	}
	catch (err){}
})

const isHelpVisible = computed(() => mainStore.help)

const targetImage = computed(() => {
	const src = `${import.meta.env.VITE_BASE_URL}${mainStore.currentTask?.targetImage}`
	return src
})

function pictureSourceFormat(species, imageIdx, mode) {
	if (mainStore.currentTask === undefined) { return ""; }
	let speciesObj = {};
	if (typeof species === "number") {
		speciesObj = mainStore.currentTask.species[species]
	}
	else {speciesObj = species}
	const localUrl = `${import.meta.env.VITE_BASE_URL}${speciesObj?.imagesFolder}/${mode}/${imageIdx}.jpg`
	return localUrl
}

function getNow() {
	var today = new Date();
	return today;
}

//const initialVal = 'Most Similar Images from this Species';
const itemsPics = ['Most Similar Images from this Species', 'Least Similar Images from this Species'];
const model = null;



async function startTaskAsync(ev) {
	try {
		if (mainStore.currentDs?.tasks === undefined || mainStore.currentTask === undefined) { return; }
		store.setStart(getNow())
		mainStore.hideHelp()
		await traceLog({
			event: "hide-help-page",
			params: {
				interface: mainStore.currentUI
			},
			timestamp: new Date(),
			userID: mainStore.user
		})
		mainStore.train()
		scroll(0,0)
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

async function openTabAsync(tabIdx, label) {
	try {
		idTab.value = tabIdx
		if (mainStore.currentDs?.tasks === undefined || mainStore.currentTask === undefined) { return; }
		await traceLog(
			{
				event: "switch-images-tabSet",
				params: {
					taskIdx: mainStore.runTask.length,
					species: mainStore.currentTask.species[store.cardNumber].speciesName,
					caseLabel: label
				},
				timestamp: new Date(),
				userID: mainStore.user
			})
	}
	catch (error) { console.error(JSON.stringify(error)) }
}

async function openSpeciesCard(s) {
	try {
		if (mainStore.currentDs?.tasks === undefined || mainStore.currentTask === undefined) { return; }
		const species = s ?? []
		const speciesIdx = mainStore.currentTask?.species?.indexOf(s) ?? 0
		await traceLog({
			event: "openSpeciesCard",
			params: {
				taskIdx: mainStore.runTask.length,
				species: species
			},
			timestamp: new Date(),
			userID: mainStore.user
		})
		store.openPage(speciesIdx)
	} catch (err) { console.log(err) }

}

async function openWikiLinkAsync(species) {
	try {
		store.addWikiClick();
		if (mainStore.currentDs?.tasks === undefined || mainStore.currentTask === undefined) { return; }
		await traceLog({
			event: "openWikiLink",
			params: {
				taskIdx: mainStore.runTask.length,
				species: species.speciesName
			},
			timestamp: new Date(),
			userID: mainStore.user
		})
	}
	catch (error) {
		console.error(error)
	}
}

async function handleClosePageAsync(species) {
	try {
		store.closePage();
		scroll(0,0)
		if (mainStore.currentDs?.tasks === undefined || mainStore.currentTask === undefined) { return; }
		await traceLog({
			event: "closeSpeciesCard",
			params: {
				taskIdx: mainStore.runTask.length,
				species: species?.speciesName,
			},
			timestamp: new Date(),
			userID: mainStore.user
		})
	}
	catch (error) { console.error(error) }

}
async function confirmAsync(ev) {
	try {
		const currentTask = mainStore.currentTask ?? null
		const rightResponse = 
			currentTask.species[store.cardNumber].speciesName === 
			currentTask.species[currentTask.correctAnswer].speciesName

		await traceLog({
			event: "confirm-selection-end-subtask",
			params: {
				species: currentTask.species[store.cardNumber].speciesName,
				taskIdx: mainStore.runTask.length,
				isRightChoice: rightResponse
			},
			timestamp: new Date(),
			userID: mainStore.user
		})
		store.addCurrentTime(getNow())
		store.addAnswer()
		store.closePage()
		scroll(0,0)
		const oldUI = mainStore.currentUI;
		store.nextTask()
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

		//mainStore.nextTask() //moved into store.nextTask(), to handle timeout (when the user runs out of time)
	}
	catch (err) { console.error(err) }
}

watch(
	() => mainStore.currentUI,
	async (newV, old) => {
		const nextPage = mainStore.navigateNext
		console.log(`hasNext ${newV} <- ${old}; navigateNext ${nextPage} `)
		try {
			await traceLog({
				event: "complete-similarity-ui",
				params: {
					species: mainStore.currentTask?.species[store.cardNumber]?.speciesName,
					taskIdx: mainStore.currentDs?.tasks?.indexOf(mainStore.currentTask),
					datasetName: mainStore.currentDs?.name
				},
				timestamp: new Date(),
				userID: mainStore.user
			})
			mainStore.consumePage()
			console.log("updating navigation to " + nextPage)
			router.push({ name: nextPage })
		}
		catch (err) { console.error(JSON.stringify(err)) }



	})

</script>