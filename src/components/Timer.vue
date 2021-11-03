<template>
    <div class="timerBlock" :class="{ active: timer.isActive}">
        <h2>{{ timer.name }}</h2>
        <div v-if="isAlarm">
            <p class='alarmText'>BEEP BEEP</p>
            <button v-if="timer.isActive" @click="resetAlarm">Stop alarm</button>
        </div>
        <div v-else>
            <p v-if="timer.isActive">Timer running:</p>
            <p v-else-if="isPaused" >Timer paused:</p>
            <p v-else >Time:</p>
            <p class="time">{{ timer.minutes }}:{{ timer.seconds }}</p>
            <div v-if="timer.isActive">
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


        // alarm sound that loops
        let alarmSound = new Audio("https://www.mboxdrive.com/alarm_r.mp3")
        alarmSound.loop = true

        const originalMinutes = props.timer.minutes
        const originalSeconds = props.timer.seconds

        const stopTimer = () => {
            clearInterval(interval)
            isPaused.value = false
            props.timer.isActive = false
            props.timer.minutes = originalMinutes
            props.timer.seconds = originalSeconds
            timer = totalTime

            if(isAlarm.value){
                isAlarm.value = false
                alarmSound.pause()
                alarmSound.currentTime = 0
            }
            console.log("timer gestopt")
        }

        const pauseTimer = () => {
            props.timer.isActive = false
            isPaused.value = true
            clearInterval(interval)
        }


        const startTimer = () => {
            isPaused.value = false
            context.emit('start', props.timer.id)
            props.timer.isActive = true
    
            interval = setInterval(() => {
            if (timer === 0) {
                clearInterval(interval)
                console.log('timer klaar')                
                isAlarm.value = true
                alarmSound.play()
            } else {
                timer--
                if(props.timer.seconds > 0) {
                   props.timer.seconds-- 
                } else {
                    props.timer.minutes-- 
                    props.timer.seconds = 59
                }
                console.log(timer)
            }      
            }, 1000)
        }

        const deleteTimer = async () => {
            await projectFirestore.collection('timers')
            .doc(props.timer.id)
            .delete()
            context.emit('delete', props.timer.id)
        }

        const resetAlarm = () => {
            stopTimer()
            isAlarm.value = false;
        }

        return {deleteTimer, startTimer, stopTimer, isAlarm, isPaused, alarmSound, resetAlarm, pauseTimer}
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