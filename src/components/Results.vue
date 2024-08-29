<template>
    <div class="result-page">
        <h2 class="headline-large" style="margin-top: 10px;">
            Oracle Interface Results
        </h2>
        <img style="max-width: 700px;" src="./../assets/HowToOracle.png">
        <div>
            <p class="title-medium">
                Correct Answers: {{ oracleUserCorrectTotal }} / {{ 10 }}
            </p>
            <p class="title-medium">
                Total Time: {{ oracleTotalTime }} seconds
            </p>
        </div>
        <h2 class="headline-large" style="margin-top: 10px;">
            Similarity Interface Results
        </h2>
        <img style="max-width: 700px;" src="./../assets/Step1Interaction.png">

        <div>
            <p class="title-medium">
                Correct Answers: {{ similarityUserCorrectTotal }} / {{ 10 }}
            </p>
            <p class="title-medium">
                Total Time: {{ similarityTotalTime }} seconds
            </p>
        </div>

        <div style="margin: 20px;" v-if="((similarityUserCorrectTotal + oracleUserCorrectTotal) > 18) && ((similarityTotalTime + oracleTotalTime) < 150)">
            <p class="title-large">
                Congratulations, you are as good as a Professional Birdwatcher
            </p>
        </div>
        <div style="margin: 20px;" v-else-if="((similarityUserCorrectTotal + oracleUserCorrectTotal) > 8) && ((similarityTotalTime + oracleTotalTime) < 250)">
            <p class="title-large">
                Congratulations, you are as good as as Amateur Birdwatcher
            </p>
        </div>
        <div style="margin: 20px;" v-else>
            <p class="title-large">
                Congratulations, you are as good as a Novice Birdwatcher
            </p>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { oracleStore } from '@/store/iStore';
import { interactionStore } from '@/store/iStore';

const iStore = interactionStore()
const oStore = oracleStore()


const localOracle = JSON.parse(localStorage.getItem('oracleResults'))
const localSimilarity = JSON.parse(localStorage.getItem('interactionResults'))
var correctOracle, correctSimilarity

var oracleAnswersUser = ref([])
var oracleAnswersCorrect = ref([])

var oracleUserCorrect = ref([])
var oracleUserCorrectTotal = ref(0)

var oracleTimePerTask = ref([])
var oracleTotalTime = ref(0)


var similarityAnswersUser = ref([])
var similarityAnswersCorrect = ref([])

var similarityUserCorrect = ref([])
var similarityUserCorrectTotal = ref(0)

var similarityTimePerTask = ref([])
var similarityTotalTime = ref(0)

fetch('./src/assets/pool1/info.json', {
    headers: {
        'Accept': 'application/json',
    }
})
    .then(response => response.json())
    .then(response => {
        var tempData = JSON.stringify(response)
        correctOracle = JSON.parse(tempData)


        for (let i = 0; i < 10; i++) {
            //oracleAnswersCorrect.value.push(correctOracle['tasks'][i]["correctAnswer"])
            //oracleAnswersUser.value.push(localOracle[i]["answerGiven"])

            oracleAnswersCorrect[i] = correctOracle['tasks'][i]["correctAnswer"]
            oracleAnswersUser[i] = localOracle[i]["answerGiven"]
            if (oracleAnswersCorrect[i] == oracleAnswersUser[i]) {
                oracleUserCorrect.value.push(1)
                oracleUserCorrectTotal.value += 1
            }
            else {
                oracleUserCorrect.value.push(0)
            }

            oracleTimePerTask[i] = localOracle[i]["timePerTask"]
            oracleTotalTime.value += localOracle[i]["timePerTask"]
            oracleTotalTime.value = Math.round(oracleTotalTime.value * 100) / 100

        }
    });

fetch('./src/assets/pool2/info.json', {
    headers: {
        'Accept': 'application/json',
    }
})
    .then(response => response.json())
    .then(response => {
        var tempData = JSON.stringify(response)
        correctSimilarity = JSON.parse(tempData)



        for (let i = 0; i < 10; i++) {
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
        }

    });



</script>