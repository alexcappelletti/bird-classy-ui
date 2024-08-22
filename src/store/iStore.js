import { ref } from 'vue';
import { defineStore } from "pinia";

export const interactionStore = defineStore('interactionStore',{
    state: () => {
        return {    
            //Storing the JSON
            dataJson:  {},

            //Data to obtain before loading the page
            startingTime: 0,
            startSet: false,
            currentTask: 0,
            speciesNumber: 3,
            speciesNames: [[]],
            speciesDescription: [[]],
            //speciesPics:[],
            speciesPics:[],
            speciesWikiLink: [[]],
            speciesTimer: [],

            //path to the target images
            targetPics: [],
            
            //Index of the last task without timer, 1 means from the third one the timer will appear
            indexNoTimer: 1,

            //Data regarding actions in the page
            cardOpened: false,
            cardNumber: 0,
            appearInfo: false,

            timerOn: false,

            //PageHelp
            HelpPage: true,

            CollectedData:[{
                "timePerTask": null,
                "answerGiven": null,
                "openedWiki": [false, false, false]
            }],

            totalTime: 0,
        }
    },
    getters: {
        currentSpecies(state){
            return state.speciesNames[state.currentTask][state.cardNumber];
        },

        currentDescription(state){
            return state.speciesDescription[state.currentTask][state.cardNumber].substr(0, 260);
        },

        currentLink(state){
            return state.speciesWikiLink[state.currentTask][state.cardNumber];
        },

        currentTargetPic(state){
            return state.targetPics[state.currentTask];
        }
    },
    actions: {
        loadData(path){
            fetch(path,{
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
            //this.speciesPics.pop()
            for(let i = 0; i < this.dataJson["tasks"].length; i++){
                this.speciesNames.push(this.dataJson["tasks"][i]["species"])
                this.speciesDescription.push(this.dataJson["tasks"][i]["descriptions"])
                this.speciesWikiLink.push(this.dataJson["tasks"][i]["links"])
                this.targetPics.push(this.dataJson["tasks"][i]["targetpic"])
                this.speciesPics.push(this.dataJson["tasks"][i]["pics"])
            }
            //console.log(this.dataJson)
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

        bestPic(speciesIndex, picPosition){
            return this.speciesPics[speciesIndex][picPosition]
        },

        worstPic(speciesIndex, picPosition){
            return this.speciesPics[speciesIndex][this.speciesPics[speciesIndex].length - picPosition]
        },

        openHelp(){
            this.HelpPage = !this.HelpPage
        },

        setTimer(picNumber, time){
            this.speciesTimer[picNumber] = time
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
            if(this.currentTask + 1 == this.dataJson["tasks"].length){
                var dataToWrite = JSON.stringify(this.CollectedData)
                var bb = new Blob([dataToWrite],{ type: "application/json" });
                var a = document.createElement('a');
                a.download = 'TaskFile.txt';
                a.href = window.URL.createObjectURL(bb);
                a.click();
            }
            else if(this.currentTask < this.dataJson["tasks"].length){
                this.CollectedData.push({
                    "timePerTask": null,
                    "answerGiven": null,
                    "openedWiki": [false, false, false]
                });
                this.timerOn = false;
                this.currentTask = this.currentTask + 1;
                //console.log(this.currentTask)
            }
        },

        //I should think of a way to pause the timer if one is on the helpPage
        createProgressbar(callback) {

            if(this.timerOn == false && this.currentTask > this.indexNoTimer){
                
                this.timerOn = true;

                // We select the div that we want to turn into a progressbar
                var progressbar = document.getElementById('pgbar');
            
                // We create the div that changes width to show progress
                var progressbarinner = document.createElement('div');
                progressbarinner.className = 'inner';
                progressbarinner.setAttribute('id', 'innerbar');
            
                // Now we set the animation parameters
                progressbarinner.style.animationDuration = '60s';


                progressbarinner.addEventListener('animationend', (e) => {
                    this.timeOut();
                })

                // Eventually couple a callback
                if (typeof(callback) === 'function') {
                    progressbarinner.addEventListener('animationend', callback);
                }


            
                // Append the progressbar to the main progressbardiv
                progressbar.appendChild(progressbarinner);
            
                // When everything is set up we start the animation
                progressbarinner.style.animationPlayState = 'running';

            }
        },

        removeBar(){
            if(this.currentTask > this.indexNoTimer + 1){
                var progressbar = document.getElementById('innerbar');
                progressbar.parentNode.removeChild(progressbar);
            }
            
        },

        timeOut(){
            this.addCurrentTime(new Date());
            this.closePage();
            this.nextTask();
            this.removeBar();
            this.createProgressbar();
        }
    }
})

export const oracleStore = defineStore('oracleStore',{
    state: () => {
        return {

            //Storing the JSON
            dataJson:  {},

            //Data to obtain before loading the page
            //Starting point for the timer
            startingTime: 0,
            startSet: false,
            //Index of the task the user is completing
            currentTask: 0,
            //Number of displayed results
            speciesNumber: 3,

            //Index of the last task without timer, 1 means from the third one the timer will appear
            indexNoTimer: 1,

            //paths to the target images
            targetPics: [],

            speciesNames: [[]],
            speciesDescription: [[]],
            speciesPics:[],
            //speciesPics:[[]],
            speciesConfidence: [[]],
            speciesWikiLink: [[]],

            //Timestamp to calculate how much time each task required to be completed
            speciesTimer: [],

            //Data for displaying information
            speciesVisualized: 0,

            //PageHelp
            HelpPage: true,

            //Used to check if the timer was already started for each task, reset on completion of previous task
            timerOn: false,
            
            //Inital settings, empty, to add values during the usage
            CollectedData:[{
                "timePerTask": null,
                "answerGiven": null,
                "openedWiki": [false, false, false]
            }],

            totalTime: 0,
        }
    },
    getters: {
        currentSpecies(state){
            return state.speciesNames[state.currentTask][state.speciesVisualized]
        },

        currentDescription(state){
            return state.speciesDescription[state.currentTask][state.speciesVisualized].substr(0, 320)
        },

        currentLink(state){
            return state.speciesWikiLink[state.currentTask][state.speciesVisualized]
        },

        currentConfidence(state){
            return state.speciesConfidence[state.currentTask][state.speciesVisualized]
        },

        currentTargetPic(state){
            return state.targetPics[state.currentTask];
        }
    },
    actions: {

        loadData(path){
            fetch(path,{
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
            this.speciesConfidence.pop()
            for(let i = 0; i < this.dataJson["tasks"].length; i++){
                this.speciesNames.push(this.dataJson["tasks"][i]["species"])
                this.speciesDescription.push(this.dataJson["tasks"][i]["descriptions"])
                this.speciesWikiLink.push(this.dataJson["tasks"][i]["links"])
                this.speciesConfidence.push(this.dataJson["tasks"][i]["confidence"])
                this.targetPics.push(this.dataJson["tasks"][i]["targetpic"])
                //this.speciesPics.push(this.dataJson["tasks"][i]["pics"])
            }
        },
        
        bestPic(speciesIndex, picPosition){
            return this.speciesPics[speciesIndex][picPosition]
        },
        worstPic(speciesIndex, picPosition){
            return this.speciesPics[speciesIndex][this.speciesPics[speciesIndex].length - picPosition]
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
            //add the subtraction from startingTime and time
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
            if(this.currentTask + 1 == this.dataJson["tasks"].length){
                var dataToWrite = JSON.stringify(this.CollectedData)
                var bb = new Blob([dataToWrite],{ type: "application/json" });
                var a = document.createElement('a');
                a.download = 'TaskFile.txt';
                a.href = window.URL.createObjectURL(bb);
                a.click();
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
                this.createProgressbar('pgbar')
            }
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

        //I should think of a way to pause the timer if one is on the helpPage
        createProgressbar(callback) {

            if(this.timerOn == false && this.currentTask > this.indexNoTimer){
                
                this.timerOn = true;

                // We select the div that we want to turn into a progressbar
                var progressbar = document.getElementById('pgbar');
            
                // We create the div that changes width to show progress
                var progressbarinner = document.createElement('div');
                progressbarinner.className = 'inner';
                progressbarinner.setAttribute('id', 'innerbar');
            
                // Now we set the animation parameters
                progressbarinner.style.animationDuration = '60s';

                progressbarinner.addEventListener('animationend', (e) =>{
                    this.timeOut();
                })
            
                // Eventually couple a callback
                if (typeof(callback) === 'function') {
                    progressbarinner.addEventListener('animationend', callback);
                }
            
                // Append the progressbar to the main progressbardiv
                progressbar.appendChild(progressbarinner);
            
                // When everything is set up we start the animation
                progressbarinner.style.animationPlayState = 'running';

            }
        },

        removeBar(){
            if(this.currentTask > this.indexNoTimer + 1){
                var progressbar = document.getElementById('innerbar');
                progressbar.parentNode.removeChild(progressbar);
            }
        },

        timeOut(){
            this.addCurrentTime(new Date());
            this.nextTask();
            this.removeBar();
            this.createProgressbar();
        },
    }
})