<template>
    <div class="timerBlock" :class="{ active: isActive}">
        <h2>{{ timer.name }}</h2>
        <div v-if="isAlarm">
            <p class='alarmText'>BEEP BEEP</p>
            <button v-if="isActive" @click="resetAlarm">Stop alarm</button>
        </div>
        <div v-else>
            <p v-if="isActive">Timer running:</p>
            <p v-else-if="isPaused" >Timer paused:</p>
            <p v-else >Time:</p>
            <p class="time">{{ timer.minutes }}:{{ timer.seconds }}</p>
            <div v-if="isActive">
                <button @click="stopTimer">Stop timer</button>
                <button @click="pauseTimer">Pause timer</button>
            </div>
            <div v-else-if="isPaused">
                <button @click="stopTimer">Reset timer</button>
                <button @click="startTimer">Continue timer</button>
            </div>
            <div v-else>
                <button @click="startTimer">Start timer</button>
                <button @click="deleteTimer">Delete</button>
            </div>
        </div>
    </div>
</template>

<script>
import {projectFirestore} from '../firebase/config'
import{ref} from 'vue'

export default {
    props: ['timer'],
    setup(props, context){
        // calculates the amount of seconds the timer should run
        const totalTime = props.timer.minutes * 60 + props.timer.seconds

        // calculates the amount of seconds the timer should run
        let timer = totalTime
        
        // variable where the interval will be stored in
        let interval = null

        // bool for when the timer's alarm is on
        let isAlarm =  ref(false)

        // bool for when the timer should be paused
        let isPaused = ref(false)

        // bool for when the timer should be active
        let isActive= ref(false)


        // alarm sound that loops
        let alarmSound = new Audio("https://www.mboxdrive.com/alarm_r.mp3")
        alarmSound.loop = true

        // stores the original amount of minutes and seconds so that
        // the time can be restored later.
        const originalMinutes = props.timer.minutes
        const originalSeconds = props.timer.seconds

        // stops the timer
        const stopTimer = () => {
            clearInterval(interval)

            // sets the pause state so that the function also works as a reset.
            isPaused.value = false

            // sets the bool to false so the program know what to display.
            isActive.value = false

            // restores the original time on display.
            props.timer.minutes = originalMinutes
            props.timer.seconds = originalSeconds

            // restores the timer amount.
            timer = totalTime

            // when the alarm is turned on, it should be turned off.
            if(isAlarm.value){
                isAlarm.value = false
                alarmSound.pause()
                alarmSound.currentTime = 0
            }
        }

        // pauses the timer
        const pauseTimer = () => {
            // sets the bool to false so the program will stop running the timer.
            isActive.value = false

            // set the bool to true so the program will know what to displays
            isPaused.value = true
            clearInterval(interval)
        }


        // starts the timer
        const startTimer = () => {
            // depauses the timer 
            isPaused.value = false

            // sets bool to true so the program knows what to display
            isActive.value = true
    
            // puts interval on the variable
            interval = setInterval(() => {
                // runs when timer runs out
                if (timer === 0) {
                    // clears the interval
                    clearInterval(interval)
                     // sets bool to true so the program knows what to display    
                    isAlarm.value = true

                    // plays the alarm sound
                    alarmSound.play()
                } else {
                    // runs when the timer is still counting down
                    timer--
                    if(props.timer.seconds > 0) {
                        // -1 on the displayed seconds 
                        props.timer.seconds-- 
                    } else {
                        // when the seconds reach 0, -1 on the minutes and display 59 again
                        props.timer.minutes-- 
                        props.timer.seconds = 59
                    }
                console.log(timer)
            }      
            }, 1000) // the amount of milliseconds the program should wait for each interval (1 second)
        }


        // deletes a timer
        const deleteTimer = async () => {
            // takes the data from the firestore database and deletes it
            await projectFirestore.collection('timers')
            .doc(props.timer.id)
            .delete()
            // after that, it will emit a custom event so the Timers component knows to delete the timer from the local data
            context.emit('delete', props.timer.id)
        }

        return {deleteTimer, startTimer, stopTimer, isAlarm, isPaused, isActive, alarmSound, pauseTimer}
    }
}

</script>

<style>
    .timerBlock {
          padding: 15px 30px;
        background: #FFF;
        border-radius: 25px;
        border: solid #E0E0E0 2px;
        text-align: center;
        margin: 10px;
        box-sizing: border-box;
        width: 350px;
        height: 240px;
    }

    .timerBlock.active {
        background: #E0E0E0;
        border: solid #757575 2px;
        -webkit-box-shadow: 0px 1px 11px 0px rgba(0,0,0,0.16); 
        box-shadow: 0px 1px 11px 0px rgba(0,0,0,0.16);
    }

    .timerBlock.active button {
        border: solid #757575 2px;
    }

    .timerBlock .alarm {
        background: red;
    }

    button {
        padding: 10px 20px;
        background: #FFF;
        text-decoration: none;
        color: #000;
        border-radius: 40px;
        margin: 0px 10px;
        border: solid #E0E0E0 2px;
        transition-duration: 0.3s;
    }

    .timerBlock button:hover {
        -webkit-box-shadow: 0px 1px 11px 0px rgba(0,0,0,0.16); 
        box-shadow: 0px 1px 11px 0px rgba(0,0,0,0.16);
    }

    .timerBlock p {
        margin: 0px;
    }

    .time {
        font-family: monospace;
        font-weight: bold;
        font-size: 50px;
        padding-bottom: 20px;
    }

    .alarmText {
        font-size: 30px;
        padding-bottom: 30px;
    }

</style>