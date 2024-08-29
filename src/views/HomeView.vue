<template>
	<div>Here is the home view</div>
	<RouterLink :to="store.secondUI">go to {{ store.secondUI }}</RouterLink>
</template>

<script setup>
import { inject, onBeforeMount } from 'vue'
const store = inject('mainStore')

onBeforeMount(() => {
    const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);

	localStorage.setItem("FirstUI", urlParams.get('FirstUI'));
	localStorage.setItem("FirstPool", urlParams.get('FirstPool'));
	localStorage.setItem("UserID", urlParams.get('id'));

})

</script>