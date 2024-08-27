import { defineStore } from "pinia"


export const useMainStore = defineStore('mainStore', {
	state: () =>({
			subject: "",
			firstUI: "",
			firstDataset: ""
		}),

	getters: {
		nextUI(state) {
			return (state.firstUI === "oracle")? "similarity": "oracle";
		},
		nextDS(state){
			return(state.firstDataset === "ds1") ? "ds2" : "ds1";
		}

	},

	 actions: {
		setExperimentContext(ctx) {
			const params = ctx.split("-");
			
			if (params.length != 3) {
				console.log("wron context params " + ctx)
				return;
			}
			this.subject = params[0]
			this.firstUI =  params[1] === "op"? "oracle-page": "similarity-page";
			this.firstDataset = params[2]  
		}
	}
})