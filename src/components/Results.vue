<template>
    <div class="result-page">

        <div style="margin: 20px;"
            v-if="(((oracleCorrects + similarityCorrects) / (oracleTime + similarityTime)) * 2400 > 75)">
            <p class="title-large">
                Congratulations, you are as good as a <b>Professional Birdwatcher</b>
            </p>
        </div>
        <div style="margin: 20px;"
            v-else-if="(((oracleCorrects + similarityCorrects) / (oracleTime + similarityTime)) * 2400 > 50)">
            <p class="title-large">
                Congratulations, you are as good as as <b>Amateur Birdwatcher</b>
            </p>
        </div>
        <div style="margin: 20px;" v-else>
            <p class="title-large">
                Congratulations, you are as good as a <b>Novice Birdwatcher</b>
            </p>
        </div>

        <div style="text-align: center">
            <p class="title-medium">Correct Answers: {{ oracleCorrects + similarityCorrects }} / {{ oracleTotal +
                similarityTotal }}</p>
            <p class="title-medium">Total Time: {{ Math.floor( (oracleTime + similarityTime) / 60) }} minutes {{
                ((oracleTime + similarityTime) % 60) }} seconds</p>
            <p>
                Total Score: {{ Math.floor(2400 * (oracleCorrects + similarityCorrects) / (oracleTime + similarityTime)) }}
            </p>
        </div>

        <div :class="{ 'reverse-interfaces' : mainStore.exprContext.uiList[0] == 'similarity', 'result-page' : mainStore.exprContext.uiList[0] == 'oracle' }">
            <div class="result-page" style="background-color: #DBE5DD; border-radius: 10px; padding-left: 20px; padding-right: 20px; padding-bottom: 10px;">

                <h2 class="headline-medium" style="margin-top: 10px;">
                    {{ topRes }} Interface Results
                </h2>
                <img style="max-width: 500px; border: 1px solid black; border-radius: 10px;" src="./../assets/oracleResults.png" >
                <div>
                    <p class="title-medium">
                        Correct Answers: {{ oracleCorrects }} / {{ oracleTotal }}
                    </p>
                    <p class="title-medium">
                        Total Time: {{ Math.floor((oracleTime) / 60) }} minutes {{ (oracleTime % 60) }}
                        seconds
                    </p>
                </div>
            </div>
            <div class="result-page" style="background-color: #DBE5DD; border-radius: 10px; padding-left: 20px; padding-right: 20px; padding-bottom: 10px;">


                <h2 class="headline-medium" style="margin-top: 10px;">
                    {{ botRes }} Interface Results
                </h2>
                <img style="max-width: 500px; border: 1px solid black; border-radius: 10px;" src="./../assets/similarityResult.png">

                <div>
                    <p class="title-medium">
                        Correct Answers: {{ similarityCorrects }} / {{ similarityTotal }}
                    </p>
                    <p class="title-medium">
                        Total Time: {{ Math.floor((similarityTime) / 60) }} minutes {{ (similarityTime % 60) }} seconds
                    </p>
                </div>
            </div>
        </div>
        <div>
            <v-btn active active-color="green-darken-4" class="ma-4" :href="compSurveyLink" target="_blank">Press here
                to open the Survey</v-btn>
        </div>

    </div>
</template>

<script setup>
import { ref } from 'vue';
import { oracleStore, interactionStore } from '@/store/iStore';
import { useMainStore } from '@/services/mainStore';
import { timerStore } from '@/store/timerStore';

const iStore = interactionStore()
const oStore = oracleStore()
const mainStore = useMainStore()
const compSurveyLink = "https://docs.google.com/forms/d/e/1FAIpQLSf1EABgtJTGQ9qXQEhoZNo-WBNiOJ0UxUwN64UxL2fCzhUGGw/viewform?usp=pp_url&entry.690602845=" + mainStore.user
const timer = timerStore()

//const localOracle = JSON.parse(localStorage.getItem('oracleResults'))
//const localSimilarity = JSON.parse(localStorage.getItem('interactionResults'))

var answerJson = ref([])
var oracleCorrects = ref(0)
var similarityCorrects = ref(0)
var oracleTotal = ref(0)
var similarityTotal = ref(0)
var oracleTime = ref(0)
var similarityTime = ref(0)
var topRes = ref('Second')
var botRes = ref('First')

const dsFile = import.meta.env.VITE_DS_FILE ?? 'undef'
const BASE_URL = import.meta.env.VITE_BASE_URL ?? '/nope/'
const dsFilePath = `${BASE_URL}${dsFile}`



fetch(dsFilePath, {
    headers: {
        'Accept': 'application/json',
    }
})
    .then(response => response.json())
    .then(response => {
        var tempData = JSON.stringify(response)
        answerJson = JSON.parse(tempData)

        /*console.log(answerJson)
        console.log(localOracle)
        console.log(localSimilarity)
        console.log(mainStore.exprContext)*/

        var localOracle = oStore.CollectedData
        var localSimilarity = iStore.CollectedData

        var dsList = mainStore.exprContext.dsList
        var uiList = mainStore.exprContext.uiList

        

        oracleTime = timer.timeSecondUI
        similarityTime = timer.timeFirstUI

        if(uiList[0] == 'oracle'){
            topRes = 'First'
            botRes = 'Second'
            oracleTime = timer.timeFirstUI
            similarityTime = timer.timeSecondUI
        }

        console.log(dsList)
        console.log(uiList)
        console.log(answerJson)

        for (let i = 0; i < answerJson.length; i++) {

            for (let j = 0; j < dsList.length; j++) {

                if (answerJson[i].name == dsList[j]) {

                    if (uiList[j] == 'oracle') {

                        for (let y = 0; y < answerJson[i].tasks.length; y++) {

                            if (localOracle[y]["answerGiven"] == answerJson[i].tasks[y].correctAnswer)
                                oracleCorrects.value++
                            oracleTotal.value++
                            //oracleTime.value += localOracle[y]["timePerTask"]


                        }
                    }
                    else if (uiList[j] == 'similarity') {

                        for (let y = 0; y < answerJson[i].tasks.length; y++) {

                            if (localSimilarity[y]["answerGiven"] == answerJson[i].tasks[y].correctAnswer)
                                similarityCorrects.value++
                            similarityTotal.value++
                            ///similarityTime.value += localSimilarity[y]["timePerTask"]

                        }
                    }

                }
            }
        }





        /*for (let i = 0; i < 10; i++) {
            similarityAnswersCorrect[i] = correctSimilarity['tasks'][i]["correctAnswer"]
            similarityAnswersUser[i] = localSimilarity[i]["answerGiven"]

            if (similarityAnswersCorrect[i] == similarityAnswersUser[i]) {
                similarityUserCorrect.value.push(1)
                similarityUserCorrectTotal.value += 1
            }
            else {
                similarityUserCorrect.value.push(0)
            }

            similarityTimePerTask[i] = localSimilarity[i]["timePerTask"]
            similarityTotalTime.value += (localSimilarity[i]["timePerTask"])
            similarityTotalTime.value = Math.round(similarityTotalTime.value * 100) / 100
        }*/

    });

</script>