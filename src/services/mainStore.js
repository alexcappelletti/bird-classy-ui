import { defineStore } from "pinia"
import { computed, ref, reactive } from "vue"
//progetto feir x raman

export const useMainStore = defineStore('mainStore', () => {

	let datasetName = ""
	const subject = ref("")
	const uiLists = ref([])
	const exprContextRef = ref({})
	const navigationPreset = ref([])
	const surveyLinks = ref([])
	const datasetList = ref([])
	const runningTasks = ref([])
	const runTask = ref([])
	const training = ref(false)
	const helpRef = ref(true)
	const currentUIName = ref("")



	const help = computed(() => { return helpRef.value })
	const currentUI = computed(() => currentUIName.value)
	const hasNextUI = computed(() => { return uiLists.value.length >= 1; })
	const nextUI = computed(() => { return uiLists.value[1] ?? undefined })
	const preset = computed(() => navigationPreset.value)
	const currentDs = computed(() => { return datasetList.value[0]; })
	const exprContext = computed(() => exprContextRef.value)
	const currentTask = computed(() => { return runningTasks.value[0]; })
	const isTrainingTask = computed(() => { return runTask.value.length < 2 && training.value; })
	const hasNextTask = computed(() => runningTasks.value.length >= 1)
	const surveyLink = computed(() => surveyLinks.value[0] ?? "not set")
	const navigateNext = computed(() => { return navigationPreset.value[0] ?? ""; })
	const user = computed(() => { return subject.value })

	function setExperimentContext(ctx) {
		const params = ctx.split("-");
		if (params.length != 3) {
			console.log("wron context params " + ctx)
			return;
		}
		subject.value = params[0]
		uiLists.value = ["oracle", "similarity"]
		navigationPreset.value = [
				"oracle-page",
				"survey-page",
				"similarity-page",
				"survey-page",
				"results-page"
			]
		surveyLinks.value = [
			"https://docs.google.com/forms/d/e/1FAIpQLSdmkvVrX2VKThLNPgMoQ7eqpvt8uz5Nyc5fqeLo1r6xkYVORA/viewform?usp=pp_url&entry.671716713=", 
			"https://docs.google.com/forms/d/e/1FAIpQLSdz3UyhWQisVnddY7TBOp6ERTfj41ktpJ4MSLPcadUMm-iYWA/viewform?usp=pp_url&entry.671716713="]
		if (params[1] === "sp") {
			uiLists.value = ["similarity", "oracle"]
			navigationPreset.value = [
				"similarity-page",
				"survey-page",
				"oracle-page",
				"survey-page",
				"results-page"
			]
			surveyLinks.value = [
				"https://docs.google.com/forms/d/e/1FAIpQLSdz3UyhWQisVnddY7TBOp6ERTfj41ktpJ4MSLPcadUMm-iYWA/viewform?usp=pp_url&entry.671716713=",
				"https://docs.google.com/forms/d/e/1FAIpQLSdmkvVrX2VKThLNPgMoQ7eqpvt8uz5Nyc5fqeLo1r6xkYVORA/viewform?usp=pp_url&entry.671716713="
			]
		}

		uiLists.value = [
			params[1] === "op" ? "oracle" : "similarity",
			params[1] === "op" ? "similarity" : "oracle",
		]
		currentUIName.value = uiLists.value[0]
		datasetName = params[2]
	}

	async function loadDatasets() {
		//const response = await fetch("src/assets/experiment.json", {
		const response = await fetch("src/assets/experiment-short.json", {
			headers: {
				'Accept': 'application/json',
			}
		})
		const obj = await response.json()
		//console.log("what read " + JSON.stringify(obj[0]))
		datasetList.value = [
			datasetName === 'ds1' ? obj[0] : obj[1],
			datasetName === 'ds1' ? obj[1] : obj[0],

		]
		runningTasks.value = datasetList.value[0].tasks;
		exprContextRef.value = {
			dsList: datasetList.value.map(x => x.name),
			uiList: uiLists.value.map(x => x)
		}
	}

	function train() {
		training.value = true;
	}

	function nextTask() {
		console.log(`nextTask`)
		const t = runningTasks.value.shift()
		runTask.value.push(t)
		if (runningTasks.value.length >= 1) { return; }
		runTask.value = []
		uiLists.value.shift()
		datasetList.value.shift()
		if (uiLists.value.length > 0 && datasetList.value.length > 0) {
			console.log(`set new task list`)
			training.value = false
			showHelp()
			runningTasks.value = datasetList.value[0].tasks
			currentUIName.value = uiLists.value[0]
			return;
		}
		training.value = false
		currentUIName.value = ""
		navigationPreset.value.shift()

	}
	function consumePage() {
		navigationPreset.value.shift()
	}

	function hideHelp() {
		helpRef.value = false
	}
	function showHelp() { helpRef.value = true }

	return {
		preset,
		isTrainingTask,
		currentUI,
		currentDs,
		currentTask,
		hasNextUI,
		hasNextTask,
		nextUI,
		setExperimentContext,
		loadDatasets,
		//similarityPic,
		nextTask,
		train,
		help,
		hideHelp,
		showHelp,
		navigateNext,
		consumePage,
		user, 
		surveyLink, 
		exprContext
	}
})
