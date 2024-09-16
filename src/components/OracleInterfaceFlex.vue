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
                    <v-progress-linear id="progressbar" bg-opacity="0.3"
                        :model-value="mainStore.currentTask.species[store.speciesVisualized].confidence"
                        :color="barColor(mainStore.currentTask.species[store.speciesVisualized].confidence / 100)"
                        rounded rounded-bar height="20px" style="width: 150px;"></v-progress-linear>
                </div>

                <div class="oracle-species-confidence">
                    <v-btn color="Primary" rounded="pill" text="Other results" base-color="#FFFFFF" height="2.5rem"
                        variant="outlined" elevation="0" @click="switchSpecies()"></v-btn>
                    <v-btn color="Primary" rounded="pill" text="Confirm Selection" height="2.5rem"
                        @click="confirmSelection()"></v-btn>
                </div>

            </div>

        </div>

        <div class="oracle-wiki-container">

            <div class="oracle-wiki-text mx-8 py-2 px-4" style="background-color: #AFCEBC;">
                <p class="oracle-wiki-description body-large" style="color:#000000;"> {{
                    mainStore.currentTask.species[store.speciesVisualized].description.substr(0,320) }}...
                    <a class='wikilink' @click="openWikiLink()"
                        :href="mainStore.currentTask.species[store.speciesVisualized].wikiLink"
                        target='_blank'>Wikipedia</a>
                </p>
            </div>
        </div>

    </div>

    <div v-else style="display: flex; flex-direction: column; align-items: center;">

        <!--<div class="interaction-help-page">
            <h2 class="headline-large">Experiment Description</h2>
            <p class="body-large" style="line-height: 1.5;">
                During this experiment you will be asked to identify various species of birds, with the help of an AI
                assistant.
            </p>
            <p class="headline-small" style="line-height: 0.5;">
                Structure
            </p>
            <p class="body-large" style="line-height: 1.5;">
                This interface is built so that, per each task, on the left of the monitor you will be shown one <b>Target Image</b>,
                which is the picture of the bird you will try to identify. While on the right 
                you will be shown the AI model guess: the name of the bird species, and its 
                confidence that the guess is correct.<br />
                If you believe the guess to be wrong, you can see the other suggestions from the model by clicking
                <b>Other Results</b>. 
                A different suggestion will be shown to you (for a total of 3 suggestions, after which they
                will rotate). The order will always be, from the most likely to be correct, to the least likely to be correct
                (based on the AI model)<br />
                In order to evaluate and confirm the suggestion, a description of the species from Wikipedia
                will
                be present at the bottom of the page, as well as the possibility to open the Wikipedia page to gather
                more
                information. <br />

                When you have decided which guess you believe to be the right one, you can confirm it by clicking the
                <b>Confirm Suggestion</b> button. <br />
                Once confirmed your selection, you will be shown another <b>Target Image</b> with its respective model
                suggestions, until the end of the experiment.<br /><br />

                In the top right corner of the screen you will be shown a bar that indicates how much time you have left
                to complete the current task. If the timer reaches 0, you will pass to the next task and it will be
                marked as an error.<br /><br />

                You will be able to go back and read the instructions anytime you want, but the time will keep going for
                the task, similarly, if you decide open the wikipedia pages of the birds, time will keep going down.
            </p>
            
            <ul style="padding-left: 25px;">
                <li class="body-large" style="line-height: 1.5;">Professional Birdwatcher</li>
                <li class="body-large" style="line-height: 1.5;">Amateur Birdwatcher</li>
                <li class="body-large" style="line-height: 1.5;">Novice Birdwatcher</li>
            </ul>

            <h2 class="headline-large">
                Example of a Task
            </h2>
            <div>
                <img style="max-width: 100%;" src="./../assets/HowToOracle.png">
            </div>
            <p class="headline-small" style="line-height: 0.5;">
                Progress
            </p>
            <p class="body-large" style="line-height: 1.5;">
                This section of the experiment will be composed of <b>10 Tasks.</b><br />
                Each task will be timed, based on the total time used and the number of correct answers, 
                after completing both interfaces you will be placed in one of 3 tiers: <br />
            </p>
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
            </p>

        </div>

        <div
            style="display: flex; flex-direction: row; justify-content: center; margin-top: -2rem; margin-bottom: 5rem;">
            <v-btn rounded="pill" color="Primary" @click="startTask()">
                To the Task
            </v-btn>
        </div>-->

        <div class="interaction-help-page" style="max-width: 800px;">
            <h2 class="headline-large">Interface Description</h2>
            <img style="max-width: 800px;" src="/src/assets/BaseOracleTutorial.png">
            <ul class="body-large" style="margin-left: 20px;">
                <li>
                    <b>Target Image</b> (left), is the picture of the bird that you will try to identify.
                </li>
                <li>
                    <b>Model Suggestion</b> (right), is the proposition made by the AI model: <b>Species</b> indicates the predicted species name, while <b>Confidence</b> indicate how much the model is sure of this prediction
                </li>
                <li>
                    <b>Description</b> (bottom), refers to the model proposition. It describes the physical attribute of what the predicted species, you can use it to check if the prediction is correct. If the information is not sufficient, you can also open the wikipedia page and look for more.
                </li>
                <li>
                    <b>Other Results</b> (button), shows you another proposition. The value that will change are the ones below <b>Model Suggestion</b> and the description. There are 3 propositions per image that will rotate, they will always be ordered by confidence (highest to lowest).
                </li>
                <li>
                    <b>Confirm Selection</b> (button), confirm the prediction that you are seeing. After having confirmed the prediction, you will be shown the next task, until the end of this section.
                </li>
            </ul>

            <!--<p style="line-height: 1.6;" class="body-large">
                The <b>Target Image</b> on the left is the picture of the bird that you will try to identify.<br>
                The <b>Model Suggestion</b> on the right is the proposition made by the AI model, <b>Species</b> indicate the predicted species name, while <b>Confidence</b> indicate how much the model is sure of this prediction<br>
                At the bottom of the page, there is going to be a <b>Description</b> of what the Predicted Species should look like (from wikipedia), you can use it to understand if the prediction is correct, 
                from there you can also open the wikipedia page to find more information.<br>
                By clicking <b>Other Results</b>, you will be given another prediction, so the values under <b>Model Suggestion</b> will change, as well as the description at the bottom of the page. Per each image to 
                identify, there will be 3 predictions, shown from the most likely (based on the AI prediction), to the least likely, after which they will rotate. <br>
                Finally, when you believe to have found the correct prediction, you can confirm it by pressing <b>Confirm Selection</b>, after which you will be moved to the next prediction, until the end of the experiment.
            </p>-->
            <h2 class="headline-large">Notes</h2>
            <p class="body-large">
                To complete each task you will be given 60 seconds, there is a timer on the right of the menu bar that will keep track of time (opening the wikipedia page or going back to the instructions will not stop the timer).
                The first two tasks will be for you to get comfortable with the interface, so the timer will not start and you can ask the assistant any question you want.
            </p>
        </div>
        <div
            style="display: flex; flex-direction: row; justify-content: center; margin-top: -2rem; margin-bottom: 5rem;">
            <v-btn rounded="pill" color="Primary" @click="startTask()">
                To the Task
            </v-btn>
        </div>

    </div>

</template>

<script setup>
import { onBeforeMount, onMounted, computed, watch } from 'vue';
import { oracleStore } from '@/store/iStore.js'
import { useMainStore } from '@/services/mainStore';
import { traceLog } from '@/services/logToMongoDBAtlas';
import { useRouter } from 'vue-router';
import { timerStore } from '@/store/timerStore';

const store = oracleStore()
const mainStore = useMainStore()
const timerSt = timerStore()

const router = useRouter()


onMounted(async () => {
    /*try {
        await traceLog(
            {
                event:"oracleTask-numTask",
                params: "TimePerTask=XXX;AnswerGiven=YYY;OpenedWiki={TFT}",
                timestamp: new Date(),
                userID: "UserID"
            })
    }catch (err) {console.log(err)}*/
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
    if (mainStore.currentDs?.tasks === undefined || mainStore.currentTask === undefined) { return; }
	store.setStart(new Date())
	store.generateTimer(); 
	mainStore.hideHelp();
	mainStore.train();
    try {
		await traceLog({
			event: "start-task-oracle-ui",
			params: {
				taskIdx: mainStore.runTask.length,
				datasetName: mainStore.currentDs.name
			},
			timestamp: new Date(),
			userID: mainStore.user
		})
	}
	catch (error) { console.error(JSON.stringify(error)) }
}

async function switchSpecies(){
    store.rotateSpecies();
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
		await traceLog({
			event: "confirm-selection-oracle-ui",
			params: {
				species: mainStore.currentTask?.species[store.speciesVisualized]?.speciesName,
				taskIdx: mainStore.runTask.length
			},
			timestamp: new Date(),
			userID: mainStore.user
		})
        store.addCurrentTime(new Date()); 
        store.addAnswer(); 
        store.nextTask(); 
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
	(newV, old) => {
		const nextPage = mainStore.navigateNext
		console.log(`hasNext ${newV} <- ${old}; navigateNext ${nextPage} `)
		console.log("updating navigation to " + nextPage)
		mainStore.consumePage();
		router.push({ name: nextPage })

	})

</script>