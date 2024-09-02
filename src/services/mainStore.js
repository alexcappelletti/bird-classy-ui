import { defineStore } from "pinia"
import { computed, ref, reactive } from "vue"
//progetto feir x raman

export const useMainStore = defineStore('mainStore', () => {

	let datasetName = ""
	const subject = ref("")
	const uiLists = ref([])
	const navigationPreset = ref([])
	const surveyLinks = ref([])
	const datasetList = ref([])
	const runningTasks = ref([])
	const runTask = ref([])
	const help = ref(true)
	const currentUI = computed(() => {
		return (uiLists.value[0])

	})

	const showHelp = computed(() => {return help.value})
	const currentDs = computed(() => { return datasetList.value[0]; })
	const currentTask = computed(()=> {return runningTasks.value[0];})
	const isTrainingTask = computed(() => {return runTask.value.length < 2;})

	const hasNextUI = computed(() => { return uiLists.value.length > 1; })
	const nextUI = computed(() => {  return uiLists.value[1] ?? "undefined";})
	const navigateTo = computed(()=>{return navigationPreset.value[0];})
	const uiListsRead = computed(() => {return uiLists.value})

	function setExperimentContext(ctx) {
		const params = ctx.split("-");
		if (params.length != 3) {
			console.log("wron context params " + ctx)
			return;
		}
		subject.value = params[0]
		uiLists.value = ["oracle", "similarity"],
			navigationPreset.value = [
				"oracle-page",
				"survey-page",
				"simiarity-page",
				"survey-page",
				"results-page"
			]
		surveyLinks.value = ["google.com", "fbk.eu"]
		if (params[1] === "sp") {
			uiLists.value = ["similarity", "oracle"]
			navigationPreset.value= [
				"simiarity-page", 
				"survey-page", 
				"oracle-page",
				"survey-page", 
				"results-page"
			 ]
			surveyLinks.value = ["fbk.eu", "google.com"]
		}

		uiLists.value = [
			params[1] === "op" ? "oracle" : "similarity",
			params[1] === "op" ? "similarity" : "oracle",
		]
		datasetName = params[2]
	}

	async function loadDatasets() {
		const response = await fetch("src/assets/experiment.json", {
			headers: {
				'Accept': 'application/json',
			}
		})
		const obj = await response.json()
		console.log("what read " + JSON.stringify(obj[0]))
		datasetList.value = [
			datasetName === 'ds1' ? obj[0] :obj[1],
			datasetName === 'ds1' ? obj[1] : obj[0],

		]
		runningTasks.value = datasetList.value[0].tasks;
	}

	function similarityPic(taskIdx, speciesIdx, mode, imageIdx) {
		const task = currentDs.value.tasks[taskIdx]
		const species = task.species[speciesIdx]
		const localUrl = `src/assets/images/${species.imagesFolder}/${mode}/${imageIdx}.jpg`
		return localUrl
	}

	function nextInContext() {
		runTask.value = []
		uiLists.value.shift()
		datasetList.value.shift()
	}
	
	function nextTask() {
		if (runningTasks.value.length > 1) {
			const t = runningTasks.value.shift()
			runTask.value.push(t)
			return;
		}
		if (hasNextUI) {
			nextInContext()
			runningTasks.value = datasetList.value[0].tasks
		}
		else {
			console.error(" invokking next on empty dataset")
			
		}

	}
	function navigate() {
		navigationPreset.value.shift();
	}

	function changeHelp() {
		help.value = ! help.value
	}

	return {
		navigationPreset,
		isTrainingTask,
		currentUI,
		currentDs,
		currentTask,
		hasNextUI,
		nextUI,
		setExperimentContext,
		loadDatasets,
		similarityPic,
		nextTask,
		nextInContext,
		changeHelp,
		showHelp,
		navigateTo,
		navigate
	}
})
