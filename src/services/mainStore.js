import { defineStore } from "pinia"
import { computed, ref, reactive } from "vue"


export const useMainStore = defineStore('mainStore', () => {

	const subject = ref("")
	const ui = ref("no")
	const currentDsName = ref("dd")
	const uiLists = ref([])
	const datasetList = ref([])
	const ds1 = ref({
		name: "",
		tasks: [
			{
				name: "",
				currentAnswer: "undefined",
				targetImage: null,
				species: {
					speciesName: "not specified",
					description: "not specified",
					wikiLink: "",
					confidence: 0,
					imagesFolder: ""
				}

			}

		]
	})
	const ds2 = ref({
		name: "",
		tasks: [
			{
				name: "",
				currentAnswer: "undefined",
				targetImage: null,
				species: {
					speciesName: "not specified",
					description: "not specified",
					wikiLink: "",
					confidence: 0,
					imagesFolder: ""
				}

			}

		]
	})
	ds1.value.name = "ds1"
	ds2.value.name = 'ds2'

	// const nextUI = computed(() => {
	// 		return (firstUI.value === "oracle")? "similarity": "oracle";
	// 	})
	// const nextDS = computed(() =>{
	// 		return(firstDataset === "ds1") ? ds1 : ds2;
	// 	})
	const currentUI = computed(() => {
		return (uiLists.value[0])

	})
	

	const currentDs = computed(() => {
		currentDsName.value = currentDsName.value ?? "ds1"
		return (currentDsName.value === 'ds1' ? ds1.value : ds2.value);
	})

	const currentDsNa = computed(() => {
		return (currentDsName.value)

	})


	const nextUI = computed(() => {
		return (currentUI.value === "oracle" ? "similarity" : "oracle");
	})

	function setExperimentContext(ctx) {
		const params = ctx.split("-");

		if (params.length != 3) {
			console.log("wron context params " + ctx)
			return;
		}
		console.log("what parsed " + JSON.stringify(params))
		subject.value = params[0]
		uiLists.value = [
			params[1], 
			params[1] === "op" ? "oracle" : "similarity"
		]
		currentDsName.value = params[2]
	}

	function nextInContext() {
		currentDsName.value = (currentDsName.value === "ds1" ? "ds2" : "ds1")
		ui.value = nextUI
	}

	

	async function loadDatasets() {
		const response = await fetch("src/assets/experiment.json", {
			headers: {
				'Accept': 'application/json',
			}
		})
		const obj = await response.json()
		console.log("what read " + JSON.stringify(obj[0]))
		ds1.value = obj[0]
		ds2.value = obj[1]
		datasetList.value = [
			currentDsName.value === 'ds1' ? obj[0] :obj[1],
			currentDsName.value === 'ds1' ? obj[1] : obj[0],

		]
	}


	function similarityPic(taskIdx, speciesIdx, mode, imageIdx) {
		const task = currentDs.value.tasks[taskIdx]
		const species = task.species[idx]
		const localUrl = `src/assets/images/${species.imagesFolder}/${mode}/${imageidx}.jpg`
		return localUrl
	}

	return {
		currentUI,
		currentDs,
		nextUI,
		currentDsNa,
		nextInContext,
		setExperimentContext,
		loadDatasets

	};
});
