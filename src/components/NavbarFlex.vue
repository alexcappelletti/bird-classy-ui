<template>
    <div class="navbar">
        <div class="navbar-elems">
            <v-btn
            v-if=!storeI.HelpPage
            width=130px
            color="OnSurfaceVariant"
            rounded="pill"
            text="How to use"
            variant="outlined"
            :disabled="!(storeI.startSet || storeO.startSet)"
            @click="storeI.openHelp(); storeO.openHelp();"
            ></v-btn>
            <v-btn
            v-else
            width=130px
            color="OnSurfaceVariant"
            rounded="pill"
            text="Go to Task"
            variant="outlined"
            :disabled="!(storeI.startSet || storeO.startSet)"
            @click="storeI.openHelp(); storeO.openHelp();"
            ></v-btn>
            <v-spacer></v-spacer>
            <p class="display-small" style="color: #404943;">
                Bird Classification
            </p>
            <v-spacer></v-spacer>
            <div id='pgbar' class="progressbar"></div>
        </div>
    </div>
</template>

<script setup>
import { interactionStore, oracleStore } from '@/store/iStore.js'
const storeI = interactionStore()
const storeO = oracleStore()

function getNow(){
    var today = new Date();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    return time
}

</script>