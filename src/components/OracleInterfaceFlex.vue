<template>
    <div v-if="!store.HelpPage" class="oracle-container" >
        <div class="oracle-prediction">
            <div class="oracle-target">
                <h2 class="headline-large">Target Image</h2>
                <v-img 
                style="border-radius: 10px;" 
                height="250"
                width="250" 
                :src="store.currentTargetPic" 
                alt="Picture of a small bird" 
                aspect-ratio="1/1" 
                ></v-img>
            </div>

            <div class="oracle-results">
                <h2 class="headline-large oracle-results-title">Model Suggestion</h2>
                <div class="oracle-species-confidence">
                    <h2 class="headline-small">Species</h2>
                    <h2 class="title-large">{{ store.currentSpecies }}</h2>
                </div>
                <div class="oracle-species-confidence">
                    <h2 class="headline-small">Confidence</h2>


                    <v-progress-linear
                    id="progressbar"
                    bg-opacity="0.3"
                    :model-value="store.currentConfidence"
                    :color="barColor(store.currentConfidence/100)"
                    rounded
                    rounded-bar
                    height="20px"
                    style="width: 150px;"
                    ></v-progress-linear>                
                </div>
                <div class="oracle-species-confidence">
                    <v-btn
                    color="Primary"
                    rounded="pill"
                    text="Other results"
                    base-color="#FFFFFF"
                    height="2.5rem"
                    variant="outlined"
                    elevation="0"
                    @click="store.rotateSpecies(); "
                    ></v-btn>
                    <v-btn
                    color="Primary"
                    rounded="pill"
                    text="Confirm Selection"
                    height="2.5rem"
                    @click="store.addCurrentTime(getNow()); store.addAnswer(); store.nextTask(); store.removeBar(); store.createProgressbar();"
                    ></v-btn>
                </div>
            </div>

        </div>

        <div class="oracle-wiki-container">
            
            <div class="oracle-wiki-text mx-8 py-2 px-4" style="background-color: #AFCEBC;">
                <p class="oracle-wiki-description body-large" style="color:#000000;"> {{ store.currentDescription }}... <a class='wikilink' @click="store.addWikiClick()" :href="store.currentLink" target='_blank'>Wikipedia</a></p>
            </div>
        </div>
    </div>
    <div v-else style="display: flex; flex-direction: column; align-items: center;">
        <div class="interaction-help-page">
        <h2 class="headline-large" >Experiment Description</h2>
        <p class="body-large" style="line-height: 1.5;">
            During this experiment you will be asked to identify various species of birds, with the help of an AI assistant. <br/><br/>
            Once at the time, you will be shown a <b>Target Image</b>, this is the picture of the bird you will try to identify.<br/>
            The AI assistant will show you its guess, the name of the bird species, as well as its confidence that the bird species is correct.<br/>
            In order to evaluate and confirm (or deny) the suggestion, a description of the species from Wikipedia will be present at the bottom of the page, as well as the possibility to open the Wikipedia page to gather more information. <br/>
            If you believe the suggestion to be wrong, you can see the other suggestions of the model by clicking <b>Other Results</b>. Other suggestions will be shown to you (for a total of 3 suggestions). <br/>
            Once confirmed your selection, you will be shown another <b>Target Image</b> with its respective model suggestions, until the end of the experiment.<br/><br/>
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
        <div>
            <img style="max-width: 100%;" src="./../assets/HowToOracle.png">
        </div>
    </div>
    <div style="display: flex; flex-direction: row; justify-content: center; margin-top: -2rem; margin-bottom: 5rem;">
        <v-btn rounded="pill" color="Primary" @click="store.setStart(getNow()); store.createProgressbar(); store.openHelp(); ">
            Switch to the Task
        </v-btn>
    </div>
</div>
    
</template>

<script setup>
import { onBeforeMount, onMounted } from 'vue';
import { oracleStore } from '@/store/iStore.js'
import { useMainStore } from '@/services/mainStore';
import { traceLog } from '@/services/logToMongoDBAtlas';
const store = oracleStore()

const mainStore = useMainStore();
console.log("count in mainstore " + mainStore.count)
onBeforeMount(() => {
    store.loadData('./src/assets/info.json')
})


onMounted(async () =>{
	try {
		await traceLog(
			{
				event:"init oracle page",
				params: "some param here",
				userID: "my new user id"
			})
	}catch (err) {console.log(err)}
})
function getNow(){
    var today = new Date();
    //var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    return today
}

function barColor(percentage){
    let c1 = 255 - ((255-30) * percentage) + 30
    let c2 = 30 + (190 * percentage)

    //return "rgb(" + ((100 - percentage) *2.56) + "," + (percentage *2.56) + ",80)";
    return "rgb(" + c1 + "," + c2 + ",0)";
}
</script>



<script>
  export default {
    beforeCreate(){
        //Insert the calls to obtain the data to display AND the conversion from binary to img to display
        //Calls for classification, Images and wikipedia information
    }
  }
</script>