import { ref } from 'vue';
import { defineStore } from "pinia";
import { useMainStore } from '@/services/mainStore';

export const interactionStore = defineStore('interactionStore',{
    state: () => {
        return {    

            //Starting point for the timer
            startingTime: 0,

            //Variable that the timer is started only once
            startSet: false,

            //Index of the last task without timer, 1 means from the third one the timer will appear
            indexNoTimer: 1,

            //Variables that manage the opening and closing of the cards
            cardOpened: false,
            appearInfo: false,

            //Indicates which card has been opened last
            cardNumber: 0,

            //Used to check if the timer (for the single task) was already started for each task, reset on completion of previous task
            //For the graphical element
            timerOn: false,

            //PageHelp
            HelpPage: true,

            //Elements that saved the user actions
            //timePerTask is the time from the start of the task, until the users click the "Confirm" Button or runs out of time
            //answerGiven is the index of the species the user selected as answer
            //openedWiki saves which links are opened by the user during the task, the index of this element is the index of the species, false = wikipedia page not opened
            CollectedData:[{
                "timePerTask": null,
                "answerGiven": null,
                "openedWiki": [false, false, false]
            }],


            //totalTime: 0, I don't think it's useful but I'm not 100% sure

            //Time given to each task before skipping
            timerDuration: 60,

            //variable to saves setIntervalID to clear it after each task
            intervalID: null,


            mainStore: useMainStore(),

            /* -------------- Data to be removed after full merge of mainStore -------------- */

            //Storing the JSON
            dataJson:  {},

            currentTask: 0,
            speciesNumber: 3,
            speciesNames: [[]],
            speciesDescription: [[]],
            //speciesPics:[],
            speciesPics:[],
            speciesWikiLink: [[]],

            //info about location of resources (pool is 1 or 2, while dataPath should be "./src/assets/pool"), generally used combined
            poolData: null,
            dataPath: null,

            //path to the target images
            targetPics: [],
            
        }
    },
    // All getters should be removed
    getters: {
        currentSpecies(state){
		    //return state.currentTask?.speciesName?.su ?? "undefined";
            //return state.speciesNames[state.currentTask][state.cardNumber];
            const species = state.speciesNames[state.currentTask][state.cardNumber]
            if(species !== undefined)
                return species
            return "undefined"
        },

        currentDescription(state){
			const descr = state.speciesDescription[state.currentTask][state.cardNumber] 
			if (descr !== undefined) {return descr.substr(0, 260)}
			return "undefined description"

        },

        currentLink(state){
            var link = state.speciesWikiLink[state.currentTask][state.cardNumber];
            if(link != undefined)
                return link;
            return null;
        },

        currentTargetPic(state){
            var targetPic = state.targetPics[state.currentTask];
            if(targetPic != undefined)
                return targetPic;   
            return null;
        }
    },
    actions: {
        loadData(path){
            //Depending on the URL, we load a different pool of images
            var poolIndex = 0;
            if((localStorage.getItem('FirstUI') == 'similarity' && localStorage.getItem('FirstPool') == '1') || (localStorage.getItem('FirstUI') == 'oracle' && localStorage.getItem('FirstPool') == '2'))
                poolIndex = 1
            else
                poolIndex = 2

            this.poolData = poolIndex;
            this.dataPath = path;
            var infoPath = path + poolIndex + "/info.json"
            fetch(infoPath,{
                headers: {
                    'Accept': 'application/json',
            }})
            .then(response => response.json())
            .then(response => {
                var tempData = JSON.stringify(response)
                this.dataJson = JSON.parse(tempData)
                this.assignData()
            });
        },

        assignData(){
            this.speciesNames.pop()
            this.speciesDescription.pop()
            this.speciesWikiLink.pop()

            for(let i = 0; i < this.dataJson["tasks"].length; i++){

                this.speciesNames.push(this.dataJson["tasks"][i]["species"])

                this.speciesDescription.push(this.dataJson["tasks"][i]["descriptions"])

                this.speciesWikiLink.push(this.dataJson["tasks"][i]["links"])

                //[this.dataPath + this.poolData + "/"] is needed to adapt the path of the pictures
                this.targetPics.push(this.dataPath + this.poolData + "/" + this.dataJson["tasks"][i]["targetpic"])

                for(let j = 0; j < this.speciesNumber; j++)
                    this.dataJson["tasks"][i]["pics"][j] = this.dataPath + this.poolData + "/" + this.dataJson["tasks"][i]["pics"][j]
                this.speciesPics.push(this.dataJson["tasks"][i]["pics"])
            }
        },

        openPage(elemNumber){
            setTimeout(() => {    
                this.cardOpened = true;
                this.appearInfo = true;
                this.cardNumber = elemNumber;
            }, 100);
            
        },

        closePage() {
            if(this.appearInfo == true){
                this.appearInfo = false;
                setTimeout(() => {
                    this.cardOpened = false;
                }, 300);
            }
        },

        getSimilarityPicBest(taskIndex, speciesIndex, picIndex){
            return this.speciesPics[taskIndex][speciesIndex] + '/best/' + picIndex + '.jpg'
        },

        getSimilarityPicWorst(taskIndex, speciesIndex, picIndex){
            return this.speciesPics[taskIndex][speciesIndex] + '/worst/' + picIndex + '.jpg'
        },

        openHelp(){
            this.HelpPage = !this.HelpPage
        },

        nextPic(){
            this.currentPic += 1
        },

        setStart(time){
            if(!this.startSet){
                this.startingTime = time
                this.startSet = true
            }
        },

        addWikiClick(){
            this.CollectedData[this.currentTask]["openedWiki"][this.cardNumber] = true;
        },

        addCurrentTime(time){

            //add the subtraction from startingTime and time
            if(this.currentTask == 0)
                this.CollectedData[this.currentTask]["timePerTask"] =  Math.round((Math.abs(time - this.startingTime)/1000)*100)/100
            else{
                var passedTime = 0
                for(let i = 0; i < this.CollectedData.length; i++)
                    passedTime += this.CollectedData[i]["timePerTask"]
                this.CollectedData[this.currentTask]["timePerTask"] = Math.round((Math.abs(time - this.startingTime)/1000 - passedTime)*100)/100
            }
        },

        addAnswer(){
            this.CollectedData[this.currentTask]["answerGiven"] = this.cardNumber
        },

        nextTask(){
            //if(this.currentTask + 1 == this.dataJson["tasks"].length){
			if (this.mainStore?.currentDs === undefined)  {return}
            if(this.mainStore.currentDs.tasks.length == 1){
                console.log("Finito")

                /*var dataToWrite = JSON.stringify(this.CollectedData)
                var bb = new Blob([dataToWrite],{ type: "application/json" });
                var a = document.createElement('a');
                a.download = 'TaskFile.txt';
                a.href = window.URL.createObjectURL(bb);
                a.click();*/

                var dataToWrite = JSON.stringify(this.CollectedData)
                localStorage.setItem('interactionResults', dataToWrite);
                clearInterval(this.intervalID);
                this.intervalID = null;
                this.blockTimerVisual()
                

            }
            else{
                this.CollectedData.push({
                    "timePerTask": null,
                    "answerGiven": null,
                    "openedWiki": [false, false, false]
                });
                this.timerOn = false;
                this.currentTask = this.currentTask + 1;

                this.generateTimer();
            }
        },


        generateTimer(){
            if(this.timerOn == false && this.currentTask > this.indexNoTimer){
                
                this.timerOn = true;

                if(this.intervalID != null){
                    clearInterval(this.intervalID)
                    this.intervalID = null;
                }

                this.timerDuration = 60;

                
                var timerElement = document.getElementById("timerNum");
                timerElement.textContent = this.timerDuration + "s";


                var barElement = document.getElementById("timerBar");
                barElement.style.width = "100px";
                
                this.intervalID = setInterval(this.reduceTime, 1000);
            }

        },

        blockTimerVisual(){
            var bar = document.getElementById("timerBar")
            bar.style.width = "0px"
            var timer = document.getElementById("timerNum")
            timer.textContent = "60s"
        },

        reduceTime(){

            if(this.timerDuration > 1){

                this.timerDuration -= 1;

                var timerElement = document.getElementById("timerNum");
                timerElement.textContent = this.timerDuration + "s";

                var barElement = document.getElementById("timerBar");
                barElement.style.width = 100 / 60 * this.timerDuration + "px";
                //maybe also change color, let's see if doesn't explode

            }
            else{

                this.addCurrentTime(new Date());
                clearInterval(this.intervalID);
                this.intervalID = null;
                this.nextTask();
            }
        },
    }
})

export const oracleStore = defineStore('oracleStore',{
    state: () => {
        return {

            //Starting point for the timer
            startingTime: 0,

            //Variable that ensures that only one timer (globally) is started
            startSet: false,

            //Index of the last task without timer, 1 means from the third one the timer will appear
            indexNoTimer: 1,

            //Indicates which species is currently shown in the task
            speciesVisualized: 0,

            //PageHelp
            HelpPage: true,

            //Used to check if the timer (for the single task) was already started for each task, reset on completion of previous task
            //For the graphical element
            timerOn: false,
            
            //Elements that saved the user actions
            //timePerTask is the time from the start of the task, until the users click the "Confirm" Button or runs out of time
            //answerGiven is the index of the species the user selected as answer
            //openedWiki saves which links are opened by the user during the task, the index of this element is the index of the species, false = wikipedia page not opened
            CollectedData:[{
                "timePerTask": null,
                "answerGiven": null,
                "openedWiki": [false, false, false]
            }],


            //totalTime: 0, I don't think it's useful but I'm not 100% sure

            //Time given to each task before skipping
            timerDuration: 60,

            //variable to saves setIntervalID to clear it after each task
            intervalID: null,


            /* -------------- Data to be removed after full merge of mainStore -------------- */


            //Storing the JSON
            dataJson:  {},

            //Index of the task the user is completing
            currentTask: 0,
            //Number of displayed results
            speciesNumber: 3,


            //paths to the target images
            targetPics: [],

            speciesNames: [[]],
            speciesDescription: [[]],
            speciesPics:[],
            //speciesPics:[[]],
            speciesConfidence: [[]],
            speciesWikiLink: [[]],

            

        }
    },
    // All getters should be removed
    getters: {
        currentSpecies(state){
            var species = state.speciesNames[state.currentTask][state.speciesVisualized];
            if(species != undefined)
                return species;
            return null;
        },

        currentDescription(state){
			const descr = state.speciesDescription[state.currentTask][state.speciesVisualized];
			if (descr != undefined) { return descr.substr(0, 260) }
			return "undefined description"

        },

        currentLink(state){
            var link = state.speciesWikiLink[state.currentTask][state.speciesVisualized];
            if(link != undefined)
                return link;
            return null;
        },

        currentConfidence(state){
            var confidence = state.speciesConfidence[state.currentTask][state.speciesVisualized];
            if(confidence != undefined)
                return confidence;
            return null;
        },

        currentTargetPic(state){
            var targetPic = state.targetPics[state.currentTask];
            if(targetPic != undefined)
                return targetPic;
            return null;
        }
    },
    actions: {
        loadData(path){
            //Depending on the URL, we load a different pool of images
            var poolIndex = 0;
            if((localStorage.getItem('FirstUI') == 'oracle' && localStorage.getItem('FirstPool') == '1') || (localStorage.getItem('FirstUI') == 'similarity' && localStorage.getItem('FirstPool') == '2'))
                poolIndex = 1
            else
                poolIndex = 2
            
            this.poolData = poolIndex;
            this.dataPath = path;
            var infoPath = path + poolIndex + "/info.json"
            fetch(infoPath,{
                headers: {
                    'Accept': 'application/json',
            }})
            .then(response => response.json())
            .then(response => {
                var tempData = JSON.stringify(response)
                this.dataJson = JSON.parse(tempData)
                console.log(this.dataJson)
                this.assignData()
            });
        
        },

        assignData(){
            this.speciesNames.pop()
            this.speciesDescription.pop()
            this.speciesWikiLink.pop()
            this.speciesConfidence.pop()
            for(let i = 0; i < this.dataJson["tasks"].length; i++){
                this.speciesNames.push(this.dataJson["tasks"][i]["species"])
                this.speciesDescription.push(this.dataJson["tasks"][i]["descriptions"])
                this.speciesWikiLink.push(this.dataJson["tasks"][i]["links"])
                this.speciesConfidence.push(this.dataJson["tasks"][i]["confidence"])
                
                //[this.dataPath + this.poolData + "/"] is needed to adapt the path of the pictures
                this.targetPics.push(this.dataPath + this.poolData + "/" + this.dataJson["tasks"][i]["targetpic"])

            }
        },
        

        setStart(time){
            if(!this.startSet){
                this.startingTime = time
                this.startSet = true
            }
        },

        rotateSpecies(){
            this.speciesVisualized = (this.speciesVisualized + 1) % this.speciesNumber;
        },

        openHelp(){
            this.HelpPage = !this.HelpPage
        },

        addWikiClick(){
            this.CollectedData[this.currentTask]["openedWiki"][this.speciesVisualized] = true;
        },

        addCurrentTime(time){
            
            if(this.currentTask == 0)
                this.CollectedData[this.currentTask]["timePerTask"] =  Math.round((Math.abs(time - this.startingTime)/1000)*100)/100
            else{
                var passedTime = 0
                for(let i = 0; i< this.CollectedData.length; i++)
                    passedTime += this.CollectedData[i]["timePerTask"]
                this.CollectedData[this.currentTask]["timePerTask"] = Math.round((Math.abs(time - this.startingTime)/1000 - passedTime)*100)/100
            }

        },

        addAnswer(){
            this.CollectedData[this.currentTask]["answerGiven"] = this.speciesVisualized
        },

        nextTask(){

            //add if to check if task is finished (pass to next UI)
			if (this.mainStore?.currentDs === undefined)  {return}
            if(this.mainStore.currentDs.tasks.length == 1){

                /*var dataToWrite = JSON.stringify(this.CollectedData)
                var bb = new Blob([dataToWrite],{ type: "application/json" });
                var a = document.createElement('a');
                a.download = 'TaskFile.txt';
                a.href = window.URL.createObjectURL(bb);
                a.click();*/

                var dataToWrite = JSON.stringify(this.CollectedData)
                localStorage.setItem('oracleResults', dataToWrite);
                clearInterval(this.intervalID);
                this.intervalID = null;
                this.blockTimerVisual();

            }
            else if(this.currentTask < this.dataJson["tasks"].length){
                this.CollectedData.push({
                    "timePerTask": null,
                    "answerGiven": null,
                    "openedWiki": [false, false, false]
                });
                this.speciesVisualized = 0;
                this.currentTask = this.currentTask + 1;

                this.timerOn = false;

                this.generateTimer();
            }

            //useMainStore.nextTask();

        },

        writeData(){
            if(this.currentTask == this.dataJson["tasks"].length){
                var dataToWrite = JSON.stringify(this.CollectedData)
                var bb = new Blob([dataToWrite],{ type: "application/json" });
                var a = document.createElement('a');
                a.download = 'TaskFile.txt';
                a.href = window.URL.createObjectURL(bb);
                a.click();
            }
        },

        generateTimer(){
            if(this.timerOn == false && this.currentTask > this.indexNoTimer){
                
                this.timerOn = true;

                if(this.intervalID != null){
                    clearInterval(this.intervalID)
                    this.intervalID = null;
                }

                this.timerDuration = 60;

                
                var timerElement = document.getElementById("timerNum");
                timerElement.textContent = this.timerDuration + "s";


                var barElement = document.getElementById("timerBar");
                barElement.style.width = "100px";
                
                this.intervalID = setInterval(this.reduceTime, 1000);
            }

        },

        blockTimerVisual(){
            var bar = document.getElementById("timerBar")
            bar.style.width = "0px"
            var timer = document.getElementById("timerNum")
            timer.textContent = "60s"
        },

        reduceTime(){

            if(this.timerDuration > 1){

                this.timerDuration -= 1;

                var timerElement = document.getElementById("timerNum");
                timerElement.textContent = this.timerDuration + "s";

                var barElement = document.getElementById("timerBar");
                barElement.style.width = 100 / 60 * this.timerDuration + "px";
                //maybe also change color, let's see if doesn't explode

            }
            else{

                this.addCurrentTime(new Date());
                clearInterval(this.intervalID);
                this.intervalID = null;
                this.nextTask();
            }
        },
    }
})