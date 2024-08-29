<template>
	<div>Here is the home view</div>
	<RouterLink :to="store.nextUI">go to {{ store.nextUI }}</RouterLink>
</template>

<script setup>
import { inject, onBeforeMount } from 'vue'
const store = inject('mainStore')


onBeforeMount(()=>{
	console.log("onBefore su home")


})

</script>