<template>
    <div class="navbar">
        <div class="navbar-elems">
            <v-btn
            v-if=!mainStore.help
            width=130px
            color="OnSurfaceVariant"
            rounded="pill"
            text="How to use"
            variant="outlined"
            :disabled="!(storeI.startSet || storeO.startSet)"
            @click="mainStore.showHelp()"
            ></v-btn>
            <v-btn
            v-else
            width=130px
            color="OnSurfaceVariant"
            rounded="pill"
            text="Go to Task"
            variant="outlined"
            :disabled="!(storeI.startSet || storeO.startSet)"
            @click="mainStore.hideHelp()"
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
import { interactionStore, oracleStore } from '@/store/iStore.js'
import { useMainStore } from '@/services/mainStore';
const storeI = interactionStore()
const storeO = oracleStore()
const mainStore = useMainStore()

</script>