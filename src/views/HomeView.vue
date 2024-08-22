<template>
	<div>Here is the home view</div>
	<RouterLink :to="store.secondUI">go to {{ store.secondUI }}</RouterLink>
</template>

<script setup>
import { inject } from 'vue'
const store = inject('mainStore')

</script>