<template>
    <div v-if="!isHelpVisible" class="interaction-container" style="margin-top: 5%;">

        <div class="interaction-vertical" style="position: fixed; left: 20%">
            <p class="headline-large">Image to Identify</p>
            <img :src="targetImage" style="border-radius: 5%;">
        </div>

        <div class="interaction-vertical" style=" position: relative; left: 15%" v-if="!store.cardOpened">
            <p class="headline-large">Suggested Images</p>

            <div class="interaction-cards">
                <v-card v-for="s in mainStore.currentTask.species" :key="s.speciesName" width="180" class="rounded-lg" hover color="Secondary95"
                    @click="store.openPage(i - 1);">
                    <v-img :src="bestSimilarPicture(s, 0)" cover></v-img>
                    <p class="body-large pa-4">{{ s.speciesName }}</p>
                </v-card>
            </div>

        </div>

        <v-fade-transition>
            <div v-show="store.appearInfo" style=" position: relative; left: 15%; margin-bottom: 200px; margin-top: -32px;">
                <v-sheet class="align-center justify-center text-center mx-auto py-6" color="Secondary95" elevation="5"
                    max-width="800px">

                    <div class="zoom-card">
                        <v-img class="mx-auto" style="border-radius: 5%;" width="300px"
                            :src="store.getSimilarityPicBest(store.currentTask, store.cardNumber, 0)"></v-img>
                        <p class="headline-large">{{ store.currentSpecies }}</p>

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
                            <v-tab :text="itemsPics[0]" @click="changeTab(0)"></v-tab>
                            <v-tab :text="itemsPics[1]" @click="changeTab(1)"></v-tab>
                        </v-tabs>
                        
                        <v-sheet v-if="idTab == 0" class="mx-auto" style="margin-top: -5px;" max-width="790" color="Secondary95">
                            <v-slide-group v-model="model" class="pa-2" show-arrows>
                                <v-slide-group-item v-for="i in 8" :key="i">

                                    <v-img class="ma-2"
                                        :src="store.getSimilarityPicBest(store.currentTask, store.cardNumber, i)"
                                        height="150px" width="150px" cover></v-img>

                                </v-slide-group-item>
                            </v-slide-group>
                        </v-sheet>
                        <v-sheet v-if="idTab == 1" class="mx-auto" style="margin-top: -5px;" max-width="790" color="Secondary95">
                            <v-slide-group v-model="model" class="pa-2" show-arrows>
                                <v-slide-group-item v-for="i in 8" :key="i">

                                    <v-img class="ma-2"
                                        :src="store.getSimilarityPicWorst(store.currentTask, store.cardNumber, i - 1)"
                                        height="150px" width="150px" cover></v-img>

                                </v-slide-group-item>
                            </v-slide-group>
                        </v-sheet>
                    

                        <div class="mx-8 py-2 px-4" style="background-color: #AFCEBC; border-radius: 20px">
                            <p id="description" class="body-large text-justify">
                                {{ store.currentDescription }}.. <a class='wikilink' :href="store.currentLink"
                                    target='_blank' @click="store.addWikiClick()">Wikipedia</a></p>
                        </div>

                        <div style="display: flex; flex-direction: row; justify-content: space-between; min-width: 600px; gap: 10px;">
                            <v-btn rounded="pill" @click="store.closePage()" style="flex-grow: 1;">
                                Back
                            </v-btn>

                            <v-btn rounded="pill" color="Primary" style="flex-grow: 2"
                                @click="store.addCurrentTime(getNow()); store.addAnswer(); store.closePage(); store.nextTask();">
                                Confirm
                            </v-btn>
                        </div>

                    </div>
                </v-sheet>
            </div>
        </v-fade-transition>
    </div>

    <div v-else style="display: flex; flex-direction: column; align-items: center">

        <div class="interaction-help-page">
            <h2 class="headline-large">Experiment Description</h2>
            <p class="body-large" style="line-height: 1.5;">
                During this experiment you will be asked to identify various species of birds, with the help of an AI
                assistant.<br /><br />
                This interface is built such that, per each task, you will be shown you will be shown one
                <b>Target Image</b>, this is the picture of the bird you will try
                to identify.<br />
                The AI assistant will propose you 3 <b>Suggested Species</b> of birds, then you will be asked to
                identify, among these suggested results, which is the correct one.<br />
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
                <b>Suggested Species</b>, until the end of the experiment. <br />
                The experiment will be timed and based on the total time used and the number of correct answers, at the
                end
                of the experiment you will be placed in one of 3 tiers: <br />
            </p>
            <ul style="padding-left: 25px;">
                <li class="body-large" style="line-height: 1.5;">Professional Birdwatcher</li>
                <li class="body-large" style="line-height: 1.5;">Amateur Birdwatcher</li>
                <li class="body-large" style="line-height: 1.5;">Novice Birdwatcher</li>
            </ul>
            <p class="body-large" style="line-height: 1.5;">
                In the top right corner of the screen you will be shown a bar that indicates how much time you have left
                to complete the current task you. If the timer reaches 0, you will pass to the next task and it will be
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

        </div>

        <div style="display: flex; flex-direction: row; justify-content: center; margin-top: -2rem; margin-bottom: 5rem;">
            <v-btn rounded="pill" color="Primary"
                @click="startTask">
                Switch to the Task
            </v-btn>
        </div>

    </div>
</template>

<script setup>
import { onBeforeMount, onMounted, ref, computed } from 'vue';
import { interactionStore } from '@/store/iStore.js'
import { useMainStore } from '@/services/mainStore';

const store = interactionStore()
const isHelpVisible = ref(true)
const mainStore = useMainStore()

onBeforeMount(() => {
    //get the info on which to load from the link
    store.loadData('./src/assets/pool', 2);
	
})

const targetImage = computed(()=>{
	const src = `src/assets/${mainStore.currentTask.targetImage}`
	return src
})


function bestSimilarPicture(species, imageIdx) {
	const localUrl = `src/assets/inferedPics/${species.imagesFolder}/best/${imageIdx}.jpg`
	return localUrl
}
function worstSimilarPicture(species, imageIdx) {
	const localUrl = `src/assets/inferedPics/${species.imagesFolder}/worst/${imageIdx}.jpg`
	return localUrl
}


function getNow() {
    var today = new Date();
    return today;
}

const initialVal = 'Most Similar Images from this Species';
const itemsPics = ['Most Similar Images from this Species', 'Least Similar Images from this Species'];
const model = null;

var idTab = ref(0)
var tab = null

function changeTab(tabVal){
    idTab.value = tabVal;
    console.log(idTab.value)
}

function changeTabItem(item){
    if(item == "Most Similar Images from this Species")
        idTab.value = 0
    else
        idTab.value = 1 
}


async function startTask(ev) {
	store.setStart(getNow()) 
	store.generateTimer()
	isHelpVisible.value = false
	
}
</script>
