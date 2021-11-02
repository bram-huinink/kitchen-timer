<template>
    <div class="timerBlock" :class="{ active: timer.isActive}">
        <h2>{{ timer.name }}</h2>
        <div v-if="isAlarm">
            <p class='alarmText'>BEEP BEEP</p>
            <button v-if="timer.isActive" @click="resetAlarm">Stop alarm</button>
        </div>
        <div v-else>
            <p>Time:</p>
            <p class="time">{{ timer.minutes }}:{{ timer.seconds }}</p>
            <button v-if="timer.isActive" @click="stopTimer">Stop timer</button>
            <button v-else @click="startTimer">Start timer</button>
            <button @click="deleteTimer">Delete</button>
        </div>
    </div>
</template>

<script>
import {projectFirestore} from '../firebase/config'
import{ref} from 'vue'

export default {
    props: ['timer'],
    setup(props, context){
        const totalTime = props.timer.minutes * 60 + props.timer.seconds

        let timer = totalTime
        let interval = null
        let isAlarm =  ref(false)

        const originalMinutes = props.timer.minutes
        const originalSeconds = props.timer.seconds

        const stopTimer = () => {
            clearInterval(interval)
            props.timer.isActive = false
            props.timer.minutes = originalMinutes
            props.timer.seconds = originalSeconds
            timer = totalTime
            console.log("timer gestopt")
        }

        const startTimer = () => {
            context.emit('start', props.timer.id)
            props.timer.isActive = true
        
            interval = setInterval(() => {
            if (timer === 0) {
                clearInterval(interval)
                console.log('timer klaar')                
                isAlarm.value = true
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

        return {deleteTimer, startTimer, stopTimer, isAlarm, resetAlarm}
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