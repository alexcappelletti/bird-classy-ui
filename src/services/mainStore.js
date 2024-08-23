import { defineStore } from "pinia"


export const useMainStore = defineStore('mainStore', {
	state: () =>({
			firstUI: "",
			firstDataset: ""
		}),

	getters: {
		secondUI(state) {
			return (state.firstUI === "oracle")? "similarity": "oracle";
		},
		secondDS(state){
			return(state.firstDataset === "ds1") ? "ds2" : "ds1";
		}

	},

	 actions: {
		
	}
})