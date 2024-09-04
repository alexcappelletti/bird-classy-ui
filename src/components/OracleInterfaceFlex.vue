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
                    <h2 class="headline-small">Species</h2>
                    <h2 class="title-large">{{ mainStore.currentTask.species[store.speciesVisualized].speciesName }}</h2>
                </div>

                <div class="oracle-species-confidence">
                    <h2 class="headline-small">Confidence</h2>
                    <v-progress-linear id="progressbar" bg-opacity="0.3" :model-value="mainStore.currentTask.species[store.speciesVisualized].confidence"
                        :color="barColor(mainStore.currentTask.species[store.speciesVisualized].confidence / 100)" rounded rounded-bar height="20px"
                        style="width: 150px;"></v-progress-linear>
                </div>

                <div class="oracle-species-confidence">
                    <v-btn color="Primary" rounded="pill" text="Other results" base-color="#FFFFFF" height="2.5rem"
                        variant="outlined" elevation="0" @click="store.rotateSpecies(); logDBSwitchSpecies()"></v-btn>
                    <v-btn color="Primary" rounded="pill" text="Confirm Selection" height="2.5rem"
                        @click="store.addCurrentTime(new Date()); store.addAnswer(); logDBConfirmSelection(); store.nextTask(); mainStore.nextTask()"></v-btn>
                </div>

            </div>

        </div>

        <div class="oracle-wiki-container">

            <div class="oracle-wiki-text mx-8 py-2 px-4" style="background-color: #AFCEBC;">
                <p class="oracle-wiki-description body-large" style="color:#000000;"> {{ mainStore.currentTask.species[store.speciesVisualized].description }}...
                    <a class='wikilink' @click="store.addWikiClick(); logDBOpenWiki()" :href="mainStore.currentTask.species[store.speciesVisualized].wikiLink"
                        target='_blank'>Wikipedia</a>
                </p>
            </div>
        </div>

    </div>

    <div v-else style="display: flex; flex-direction: column; align-items: center;">

        <div class="interaction-help-page">
            <h2 class="headline-large">Experiment Description</h2>
            <p class="body-large" style="line-height: 1.5;">
                During this experiment you will be asked to identify various species of birds, with the help of an AI
                assistant. <br /><br />
                This interface is built such that, per each task, you will be shown you will be shown one <b>Target
                    Image</b>,
                this is the picture of the bird you will try to identify.<br />
                The AI assistant will show you its guess, the name of the bird species, as well as its confidence that
                the
                bird species is correct.<br />
                In order to evaluate and confirm (or deny) the suggestion, a description of the species from Wikipedia
                will
                be present at the bottom of the page, as well as the possibility to open the Wikipedia page to gather
                more
                information. <br />
                If you believe the guess to be wrong, you can see the other suggestions of the model by clicking
                <b>Other
                    Results</b>. A different suggestion will be shown to you (for a total of 3 suggestions, after which
                they
                will rotate). <br />
                When you have decided which guess you believe to be the right one, you can confirm it by clicking the
                <b>Confirm Suggestion</b> button. <br />
                Once confirmed your selection, you will be shown another <b>Target Image</b> with its respective model
                suggestions, until the end of the experiment.<br /><br />
                This section of the experiment will be composed of 10 Tasks. <br />
                The experiment will be timed, based on the total time used and the number of correct answers, at the end
                of the experiment you will be placed in one of 3 tiers: <br />
            </p>
            <ul style="padding-left: 25px;">
                <li class="body-large" style="line-height: 1.5;">Professional Birdwatcher</li>
                <li class="body-large" style="line-height: 1.5;">Amateur Birdwatcher</li>
                <li class="body-large" style="line-height: 1.5;">Novice Birdwatcher</li>
            </ul>
            <p class="body-large" style="line-height: 1.5;">
                In the top right corner of the screen you will be shown a bar that indicates how much time you have left
                to complete the current task. If the timer reaches 0, you will pass to the next task and it will be
                marked as an error.<br /><br />
                You will be able to go back and read the instructions anytime you want, but the time will keep going for
                the task, similarly, if you decide open the wikipedia pages of the birds, time will keep going down.
            </p>
            <h2 class="headline-large">
                Example of a Task
            </h2>
            <div>
                <img style="max-width: 100%;" src="./../assets/HowToOracle.png">
            </div>

        </div>

        <div
            style="display: flex; flex-direction: row; justify-content: center; margin-top: -2rem; margin-bottom: 5rem;">
            <v-btn rounded="pill" color="Primary"
                @click="store.setStart(new Date()); store.generateTimer(); mainStore.hideHelp(); logDBSwitchToTask();">
                Switch to the Task
            </v-btn>
        </div>

    </div>

</template>

<script setup>
import { onBeforeMount, onMounted, ref, computed } from 'vue';
import { oracleStore } from '@/store/iStore.js'
import { useMainStore } from '@/services/mainStore';
import { traceLog } from '@/services/logToMongoDBAtlas';
const store = oracleStore()

const mainStore = useMainStore();
console.log("count in mainstore " + mainStore.count)
onBeforeMount(() => {
    store.loadData('./src/assets/pool', 1)
})


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
	const src = `src/assets/${mainStore.currentTask.targetImage}`
	return src
})


async function logDBSwitchToTask(){
    console.log(mainStore.currentDs)
    var taskId = mainStore.currentDs.tasks.indexOf(mainStore.currentTask)
    var user = mainStore.user
    try {
        await traceLog(
            {
                event: "oracleTask-" + taskId,
                params: "SwitchToTask",
                timestamp: new Date(),
                userID: user
            })
    }catch (err) {console.log(err)}
}

//to call after the value of store.speciesVisualized was changed
async function logDBSwitchSpecies(){
    var taskId = mainStore.currentDs.tasks.indexOf(mainStore.currentTask)
    var user = mainStore.user
    var speciesSwitched = mainStore.currentTask.species[store.speciesVisualized].speciesName
    try {
        await traceLog(
            {
                event: "oracleTask-" + taskId,
                params: "ChangeVisualizedSpeciesTo: " + speciesSwitched,
                timestamp: new Date(),
                userID: user
            })
    }catch (err) {console.log(err)}
}

async function logDBOpenWiki(){
    var taskId = mainStore.currentDs.tasks.indexOf(mainStore.currentTask)
    var user = mainStore.user
    var speciesSwitched = mainStore.currentTask.species[store.speciesVisualized].speciesName
    try {
        await traceLog(
            {
                event: "oracleTask-" + taskId,
                params: "OpenedWikipediaPageOf: " + speciesSwitched,
                timestamp: new Date(),
                userID: user
            })
    }catch (err) {console.log(err)}
}

//To call before NextTask
async function logDBConfirmSelection(){
    var taskId = mainStore.currentDs.tasks.indexOf(mainStore.currentTask)
    var user = mainStore.user
    var speciesSwitched = mainStore.currentTask.species[store.speciesVisualized].speciesName
    try {
        await traceLog(
            {
                event: "oracleTask-" + taskId,
                params: "SelectedSpecies: " + speciesSwitched,
                timestamp: new Date(),
                userID: user
            })
    }catch (err) {console.log(err)}
}

</script>



<script>
export default {
    beforeCreate() {
        //Insert the calls to obtain the data to display AND the conversion from binary to img to display
        //Calls for classification, Images and wikipedia information
    }
}
</script>