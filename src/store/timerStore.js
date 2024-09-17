import { defineStore } from "pinia";

export const timerStore = defineStore('timerStore',{
    state: () => {
        return {    
            startTime: 0,
            stopwatchInterval: null,
            elapsedPausedTime: 0,
            timeFirstUI: 0,
            timeSecondUI: 0,
        }
    },
    actions: {
        startStopwatch() {
            if (!this.stopwatchInterval) {
              this.startTime = new Date().getTime() - this.elapsedPausedTime; // get the starting time by subtracting the elapsed paused time from the current time
              this.stopwatchInterval = setInterval(this.updateStopwatch, 1000); // update every second
            }
        },

        stopStopwatch() {
            console.log("stop")
            clearInterval(this.stopwatchInterval); // stop the interval
            this.elapsedPausedTime = new Date().getTime() - this.startTime; // calculate elapsed paused time
            if(this.timeFirstUI == 0)
                this.timeFirstUI = Math.floor(this.elapsedPausedTime / 1000)
            else if(this.timeSecondUI == 0)
                this.timeSecondUI = Math.floor((this.elapsedPausedTime / 1000) - this.timeFirstUI)

            this.stopwatchInterval = null; // reset the interval variable
        },

        updateStopwatch() {
            var currentTime = new Date().getTime(); // get current time in milliseconds
            var elapsedTime = currentTime - this.startTime; // calculate elapsed time in milliseconds
            var seconds = Math.floor(elapsedTime / 1000) % 60; // calculate seconds
            var minutes = Math.floor(elapsedTime / 1000 / 60) % 60; // calculate minutes
            var displayTime = this.pad(minutes) + ":" + this.pad(seconds); // format display time
            document.getElementById("stopwatch").innerHTML = displayTime; // update the display
        },

        pad(number) {
            // add a leading zero if the number is less than 10
            return (number < 10 ? "0" : "") + number;
        },
    }
})