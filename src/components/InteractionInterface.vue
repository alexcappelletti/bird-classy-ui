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
                Depending on the time you use and the amount of correct answer you give, you will be placed in one of three tiers:
            </p>
            <ul style="padding-left: 20px;" class="body-large">
                <li>Professional Birdwatcher</li>
                <li>Amateur Birdwatcher</li>
                <li>Novice Birdwatcher</li>
            </ul>

            <!---<p class="body-large" style="line-height: 1.5;">
                During this experiment you will be asked to identify various species of birds, with the help of an AI
                assistant.
			</p>
            <p class="headline-small" style="line-height: 0.5;">
                Structure
            </p>
            <p class="body-large" style="line-height: 1.5;">
                This interface is built such that, per each task, on the left of the monitor you will be shown one
                <b>Target Image</b>, which is the picture of the bird you will try to identify. While on the right,
                you will be proposed 3 <b>Suggested Species</b> of birds (based on the AI model), you will then be asked to
                identify, among these suggested results, which is the correct one. The suggested species will be shown
				so that the left-most one is the one with the highest likely to be correct (based on the AI model guess), while 
				the right-most one is the lowest likely to be correct (based on the AI model guess).<br />
                In order to identify the correct species, for each of the <b>Suggested Species</b>, you will be given
                multiple tools:<br />
            </p>
            <ul style="padding-left: 25px;">
                <li class="body-large" style="line-height: 1.5;">A brief physical description of the bird, from its
                    Wikipedia page;</li>
                <li class="body-large" style="line-height: 1.5;">The ability to open the Wikipedia page in order to find
                    more information;</li>
                <li class="body-large" style="line-height: 1.5;">A series of picture of said species that are the
                    <b>Most Similar</b>
                    to the target image, according to the AI assistant;</li>
                <li class="body-large" style="line-height: 1.5;">A series of picture of said species that are the
                    <b>Least Similar</b>
                    to the target image, according to the AI assistant;</li>
            </ul>
            <p class="body-large" style="line-height: 1.5;">
                When you have decided which guess you believe to be the right one, you can confirm it by opening the
                bird page and clicking on the
                <b>Confirm Selection</b> button. <br />
                Once confirmed your selection, you will be shown another <b>Target Image</b> and a new series of
                <b>Suggested Species</b>, until the end of the experiment. <br /><br />

				In the top right corner of the screen you will be shown a bar that indicates how much time you have left
                to complete the current task. If the timer reaches 0, you will pass to the next task and it will be
                marked as an error.<br /><br />
                You will be able to go back and read the instructions anytime you want, but the time will keep going for
                the task, similarly, if you decide open the wikipedia pages of the birds, time will keep going down.
			</p>
            

            <h2 class="headline-large">
                Example of a Task
            </h2>
            <p class="body-large" style="line-height: 1.5;">
                1. This will be the initial interface, with the <b>Target Image</b> on the left and the 3 <b>Suggested
                    Species</b> on the right
            </p>
            <img style="max-width: 100%;" src="./../assets/Step1Interaction.png">
            <p class="body-large" style="line-height: 1.5;">
                2. By clicking one of the suggested species, the card will open and it will show you more information
                that you can navigate through
            </p>
            <img style="max-width: 100%;" src="./../assets/Step2Interaction.png">
            <p class="body-large" style="line-height: 1.5;">
                3. Once you analysed the information, you will be able to confirm the selection, if you believe that the
                species is the correct one, or go back to the initial interface and analyse the others species
            </p>
			<p class="headline-small" style="line-height: 0.5;">
                Progress
            </p>
            <p class="body-large" style="line-height: 1.5;">
                This section of the experiment will be composed of <b>10 Tasks.</b><br />
                Each task will be timed, based on the total time used and the number of correct answers, 
                after completing both interfaces you will be placed in one of 3 tiers: <br />
			</p>
			<ul style="padding-left: 25px;">
                <li class="body-large" style="line-height: 1.5;">Professional Birdwatcher</li>
                <li class="body-large" style="line-height: 1.5;">Amateur Birdwatcher</li>
                <li class="body-large" style="line-height: 1.5;">Novice Birdwatcher</li>
            </ul>
            <h2 class="headline-small" style="line-height: 0.5;">Notes</h2>
            <p class="body-large" style="line-height: 1.5;">
                The first two tasks will be for you to explore and learn the interface, the timer for neither of the
                tasks will be started, the navigation bar on top will also change color, to signal that you are in 
                the tutorial section.
                During this time, you can also ask any question to the assistant. <br />
                After the second task, the bar on top will change color once again, to signal that the experiment is started. 
                The timer for the task will be started and
                from that moment up until you complete this section, you should avoid interacting with the assistant.
                When you reach the end of this section, the interface will change and you will be asked to complete a 
                survey on the interface you just used.
            </p>-->
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