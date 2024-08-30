import { defineStore } from "pinia"
import { computed, ref, reactive } from "vue"

const defaultDataset = ref({
	


})

export const useMainStore = defineStore('mainStore', ()=> {

	const subject = ref("")
	const ui= ref("no")
	const currentDsName = ref("dd")
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
					imageUri: ""
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
					imageUri: ""
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
		ui.value = ui.value ?? "oracle";
		return (ui.value)
		
	})
	
	const currentDs = computed(() => {
		currentDsName.value = currentDsName.value ?? "ds1"
		return (currentDsName.value === 'ds1'?  ds1.value:  ds2.value);
	})

	const currentDsNa = computed(() => {
		return (currentDsName.value)

	})


	const nextUI = computed(() => {
		return (currentUI.value === "oracle" ?  "similarity": "oracle");
	})
	
	 function setExperimentContext(ctx) {
			const params = ctx.split("-");
			
			if (params.length != 3) {
				console.log("wron context params " + ctx)
				return;
			}
			console.log("what parsed " + JSON.stringify(params))
			subject.value = params[0]
			ui.value =  params[1] === "op"? "oracle": "similarity";
			currentDsName.value = params[2]  
	}
	

	function nextInContext() {
		currentDsName.value = (currentDsName.value === "ds1" ? "ds2": "ds1")
		ui.value = nextUI
	}

	async function loadDatasets(){
		const response = await fetch("src/assets/tasks-ds1.json", {
			headers: {
				'Accept': 'application/json',
			}
		})
		const obj = await response.json()
		console.log("what read " + JSON.stringify(obj[0]))
		ds1.value = obj[0]
		ds2.value = obj[1]
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
