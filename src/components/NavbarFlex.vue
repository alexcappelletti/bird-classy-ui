<template>
    <div class="navbar" :class="{training:isTraining}">
        <div class="navbar-elems">
            <v-btn
            v-if=!mainStore.help
            width=130px
            color="OnSurfaceVariant"
            rounded="pill"
            text="How to use"
            variant="outlined"
            :disabled="!(storeI.startSet || storeO.startSet)"
            @click="mainStore.showHelp(); logDBSwitchToHelp();"
            ></v-btn>
            <v-btn
            v-else
            width=130px
            color="OnSurfaceVariant"
            rounded="pill"
            text="Go to Task"
            variant="outlined"
            :disabled="!(storeI.startSet || storeO.startSet)"
            @click="mainStore.hideHelp(); logDBSwitchToTask();"
            ></v-btn>
            <v-spacer></v-spacer>
            <p class="display-small" style="color: #404943;">
                Bird Classification
            </p>
            <v-spacer></v-spacer>
            <!--<div id='pgbar' class="progressbar"></div>-->
            <div id="timerDiv">
                <p id="timerNum" class="body-medium">60s</p>
                <div id="bgBar" style="min-width: 100px; background-color: gray; height: 5px; border-radius: 5px;">
                    <div id="timerBar" style="width: 0px; height: 5px; background-color: #19ff85; border-radius: 5px;"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import {computed} from 'vue'
import { interactionStore, oracleStore } from '@/store/iStore.js'
import { useMainStore } from '@/services/mainStore';
const storeI = interactionStore()
const storeO = oracleStore()
const mainStore = useMainStore()

const isTraining = computed(() => mainStore.isTrainingTask)

async function logDBSwitchToTask(){
    var taskId = mainStore.currentDs.tasks.indexOf(mainStore.currentTask)
    var interfaceTask = mainStore.currentUI
    var user = mainStore.user
    console.log(interfaceTask)
    try {
        await traceLog(
            {
                event: interfaceTask + "Task-" + taskId,
                params: "SwitchToTask",
                timestamp: new Date(),
                userID: user
            })
    }catch (err) {console.log(err)}
}

async function logDBSwitchToHelp(){
    var taskId = mainStore.currentDs.tasks.indexOf(mainStore.currentTask)
    var interfaceTask = mainStore.currentUI
    var user = mainStore.user
    console.log(interfaceTask)
    try {
        await traceLog(
            {
                event: interfaceTask + "Task-" + taskId,
                params: "SwitchToHelp",
                timestamp: new Date(),
                userID: user
            })
    }catch (err) {console.log(err)}
}

</script>


<style lang="css">

.training{
	background-color: rgb(226, 214, 43);


}

</style>