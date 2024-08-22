<template>
    <div v-if="!store.HelpPage" class="interaction-container" style="margin-top: 5%;">

        <div class="interaction-vertical" style="position: fixed; left: 200px">
            <p class="headline-large">Image to Identify</p>
            <img :src="store.currentTargetPic" style="border-radius: 5%;">
        </div>

        <div class="interaction-vertical" style=" position: absolute; left: 600px"  v-if="!store.cardOpened" >
            <p class="headline-large">Suggested Images</p>
            <div class="interaction-cards">
                <v-card v-for="i in 3" :key="i" width="180" class="rounded-lg" hover color="Secondary95" @click="store.openPage(i-1);">
                    <v-img
                        :src="store.getSimilarityPicBest(store.currentTask, i-1, 0)"
                        cover
                        ></v-img>
                        <!--<v-card-title>{{ store.speciesNames[0] }}</v-card-title>-->
                        <!--
                        <p class="body-large pa-4">{{ store.speciesNames[store.currentTask][i-1] }}</p>
                        -->
                        <p class="body-large pa-4">{{ store.speciesNames[store.currentTask][i-1] }}</p>
                </v-card>
            </div>
        </div>
        
        <v-fade-transition>
            <div  v-show="store.appearInfo" style=" position: absolute; left: 500px; margin-bottom: 200px; margin-top: -32px;">

                <v-sheet class="align-center justify-center text-center mx-auto py-6" color="Secondary95" elevation="5" max-width="800px">
                    <div class="zoom-card">
                        <v-img class="mx-auto" style="border-radius: 5%;" width="300px" :src="store.getSimilarityPicBest(store.currentTask, store.cardNumber, 0)"></v-img>
                        <p class="headline-large">{{ store.currentSpecies }}</p>
                        


                        <v-tabs
                            v-model="tab"
                            align-tabs="center"
                            color="deep-purple-accent-4"
                        >
                            <v-tab :value="1">Most Similar Images from this Species</v-tab>
                            <v-tab :value="2">Least Similar Images from this Species</v-tab>
                        </v-tabs>
                        <v-tabs-window v-model="tab" v-if="store.appearInfo">
                            <v-tabs-window-item
                                v-for="n in 2"
                                :key="n"
                                :value="n"
                            >
                                <v-sheet
                                    class="mx-auto"
                                    max-width="780"
                                    color="Secondary95"
                                >
                                    <v-slide-group
                                    :id="'picSlider' + n"
                                    v-model="model"
                                    class="pa-2"
                                    show-arrows
                                    >
                                        <v-slide-group-item
                                            v-for="i in 8"
                                            :key="i"
                                        >
                                            <!--<v-img 
                                                v-if="n == 1"
                                                class="ma-2"
                                                :src= "store.bestPic(store.cardNumber, i+1)"
                                                height="150px"
                                                width="150px"
                                                cover
                                            ></v-img>
                                            <v-img 
                                                v-if="n == 2"
                                                class="ma-2"
                                                :src= "store.worstPic(store.cardNumber, i)"
                                                height="150px"
                                                width="150px"
                                                cover
                                            ></v-img>-->

                                            <v-img 
                                                v-if="n == 1"
                                                class="ma-2"
                                                :src= "store.getSimilarityPicBest(store.currentTask, store.cardNumber, i+1)"
                                                height="150px"
                                                width="150px"
                                                cover
                                            ></v-img>
                                            <v-img 
                                                v-if="n == 2"
                                                class="ma-2"
                                                :src= "store.getSimilarityPicWorst(store.currentTask, store.cardNumber, i+1)"
                                                height="150px"
                                                width="150px"
                                                cover
                                            ></v-img>
                                    
                                        </v-slide-group-item>
                                    
                                    </v-slide-group>
                                </v-sheet>

                            </v-tabs-window-item>
                        </v-tabs-window>

                        <div class="mx-8 py-2 px-4" style="background-color: #AFCEBC; border-radius: 20px">
                            <p id="description" class="body-large text-justify">
                                {{ store.currentDescription }}.. <a class='wikilink' :href="store.currentLink" target='_blank' @click="store.addWikiClick()">Wikipedia</a></p>
                        </div>

                        <div style="display: flex; flex-direction: row; justify-content: space-between; min-width: 600px; gap: 10px;">
                            <v-btn rounded="pill" @click="store.closePage()" style="flex-grow: 1;" >
                                Back
                            </v-btn>
                            <v-btn rounded="pill" color="Primary" style="flex-grow: 2" @click="store.addCurrentTime(getNow()); store.addAnswer(); store.closePage(); store.nextTask(); store.removeBar(); store.createProgressbar('pgbar'); ">
                                Confirm
                            </v-btn>
                        </div>
                        
                    </div>
                </v-sheet>
            </div>
        </v-fade-transition>
    </div>
    <div v-else style="display: flex; flex-direction: column; align-items: center">
        <div  class="interaction-help-page">
            <h2 class="headline-large">Experiment Description</h2>
            <p class="body-large" style="line-height: 1.5;">
                During this experiment you will be asked to identify various species of birds, with the help of an AI assistant.<br/><br/>
                Once at the time, you will be shown a <b>Target Image</b>, this is the picture of the bird you will try to identify.<br/>
                The AI assistant will propose you 3 <b>Suggested Species</b> of birds, you will be then asked to identify, among these suggested results, which is the correct one.<br/>
                In order to identify the correct species, for each of the <b>Suggested Species</b>, you will be given multiple tools:<br/>
            </p>
            <ul style="padding-left: 25px;">
                <li class="body-large" style="line-height: 1.5;">A brief physical description of the bird, from its Wikipedia page;</li>
                <li class="body-large" style="line-height: 1.5;">The ability to open the Wikipedia page in order to look for more information;</li>
                <li class="body-large" style="line-height: 1.5;">A series of <b>Most Similar</b> pictures belonging to said species to the target image, according to the AI assistant</li>
                <li class="body-large" style="line-height: 1.5;">A series of <b>Least Similar</b> pictures belonging to said species to the target image, according to the AI assistant;</li>
            </ul>
            <p class="body-large" style="line-height: 1.5;">
                Once confirmed your selection, you will be shown another <b>Target Image</b> and a new series of <b>Suggested Species</b>, until the end of the experiment. <br/>
                The experiment will be timed, based on the total time used and the number of correct answers, at the end of the experiment you will be placed in one of 3 tiers: <br/>
            </p>
            <ul style="padding-left: 25px;">
                <li class="body-large" style="line-height: 1.5;">Professional Birdwatcher</li>
                <li class="body-large" style="line-height: 1.5;">Amateur Birdwatcher</li>
                <li class="body-large" style="line-height: 1.5;">Novice Birdwatcher</li>
            </ul>
            <p class="body-large" style="line-height: 1.5;">
                In the top right corner of the screen you will be shown a bar that indicates how much time you are using to complete each task.<br/><br/>
                You will be able to go back and read the instructions anytime you want, but the time will keep going for the task, similarly, if you decide open the wikipedia pages of the birds, time will still ticking.
            </p>
            <h2 class="headline-large">
                Example of a Task
            </h2> 
            <p class="body-large" style="line-height: 1.5;">
                1. This will be the initial interface, with the <b>Target Image</b> on the left and the 3 <b>Suggested Species</b> on the right
            </p>
            <img style="max-width: 100%;" src="./../assets/Step1Interaction.png">
            <p class="body-large" style="line-height: 1.5;">
                2. By clicking one of the suggested species, the card will open and it will show you more information that you can navigate through
            </p>
            <img style="max-width: 100%;" src="./../assets/Step2Interaction.png">
            <p class="body-large" style="line-height: 1.5;">
                3. Once you analysed the information, you will be able to confirm the selection, if you believe that the species is the correct one, or go back to the initial interface and analyse the others species
            </p>
        </div>
        <div style="display: flex; flex-direction: row; justify-content: center; margin-top: -2rem; margin-bottom: 5rem;">
            <v-btn rounded="pill" color="Primary" @click="store.setStart(getNow()); store.createProgressbar('pgbar'); store.openHelp();">
                Switch to the Task
            </v-btn>
        </div>
    </div>
</template>

<script setup>
import { onBeforeMount, onMounted } from 'vue';
import { interactionStore } from '@/store/iStore.js'

const store = interactionStore()

onBeforeMount(() => {
	console.log("opening json file on interactive UI version")
    store.loadData('./src/assets/info.json')
})


function getNow(){
    var today = new Date();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    return today
}

</script>

<script>
import { useGoTo } from 'vuetify'

export default {
    data: () => ({
        tab: null,
        model: null,
    }),
}
</script>
