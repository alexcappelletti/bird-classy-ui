import { defineStore } from "pinia"
import { computed, ref, reactive } from "vue"

const defaultDataset = reactive({
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

export const useMainStore = defineStore('mainStore', ()=> {

	const subject = ref("")
	const ui= ref("no")
	const currentDsName = ref("dd")
	const ds1 = defaultDataset
	const ds2 = defaultDataset
	ds1.name = "ds1"
	ds2.name = 'ds2'
		
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
		return (currentDsName.value)

	})
	
	 function setExperimentContext(ctx) {
			const params = ctx.split("-");
			
			if (params.length != 3) {
				console.log("wron context params " + ctx)
				return;
			}
			this.subject.value = params[0]
			this.ui.value =  params[1] === "op"? "oracle-page": "similarity-page";
			this.currentDsName.value = params[2]  
	}

	function nextInContext() {
		currentDsName.value = (currentDsName.vaue === "ds1" ? "ds2": "ds1")
		ui.value = (ui.value === "oracle" ? "similarity": "oracle")
	}

	async function loadDatasets(){
		const path = "./assets/tasks-ds1.json"
		let  response = await fetch(path, {
			headers: {
				'Accept': 'application/json',
			}
		})
		ds1 = response.json()
	}
	
	return {
		currentUI,
		currentDs,
		nextInContext,
		setExperimentContext,
		loadDatasets

	 };
});
