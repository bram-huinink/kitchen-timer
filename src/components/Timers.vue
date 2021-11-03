<template>
    <button @click="startAll">Start all timers</button>
    <button @click="stopAll">Stop all timers</button>
    <button @click="resetAll">Reset all timers</button>
    <div class="timers">
        <Timer 
        v-for="timer in timers"
        :key="timer.name"
        :timer="timer"
        @delete="handleDelete"
        :ref="setRef"
        />
    </div>
</template>

<script>
import Timer from './Timer.vue'
import { projectFirestore } from '../firebase/config'
import {ref} from 'vue'

export default {
    components: {Timer},
    setup(){
        // variable where the firebase data will be stored in
        const timers = ref([])

        // if there's an error, it will be stored in here
        const error = ref(null)

        // variable where an array with references to the timers will be stored in
        const timerRefs = ref([])

        // function that puts reference in the array
        const setRef = (el) => {
            if(!timerRefs.value.includes(el)){
                if(el){
                    timerRefs.value.push(el)
                }
            }
        }

        // function that fetches the data from firebase
        const load = async () => {
            try{
                const res = await projectFirestore.collection('timers').get()
                timers.value = res.docs.map(doc => {
                    return { ...doc.data(), id: doc.id }
                })
            } catch(err){
                error.value = err.message
                console.log(error.value)
            }
        }

        // runs when a delete event is emmited from a timer-child
        const handleDelete = (id) => {
            // filters out the timer that is deleted
            timers.value = timers.value.filter((timer) => {
                return timer.id !== id
            })

        }

        // stops all timers 
        const stopAll = () => {
            // goes through the array with refs to call the stopTimer method for each one
            timerRefs.value.forEach((item) => {
                // checks if the timer is active, if so it runs the method.
                // this prevents that paused timers will be reset
                if(item.timer.isActive) {
                    item.stopTimer()
                }
            })
        }

        // goes through the array with refs to call the startTimer method for each one
        const startAll = () => {
            timerRefs.value.forEach((item) => {
                    if(!item.timer.isActive && item) {
                        item.startTimer()
                    }
            })
        }
        
        // stops all timers regardless of if they are paused or not
        const resetAll = () => {
            // goes through the array with refs to call the stopTimer method for each one
            timerRefs.value.forEach((item) => {
                if(item.timer.isActive) {
                    item.stopTimer()
                }
            })
        }


    load()

    return {
        timers, 
        error, 
        load, 
        handleDelete, 
        stopAll, 
        startAll, 
        resetAll, 
        timerRefs, 
        setRef, 
        }
    }

}
</script>

<style>
    .timers {
        display: flex;
        flex-wrap:   wrap;
    }
</style>