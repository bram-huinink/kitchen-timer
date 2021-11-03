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
        @start="handleStart"
        :ref="setRef"
        />
    </div>
</template>

<script>
import { ref } from 'vue'
import Timer from './Timer.vue'
import { projectFirestore } from '../firebase/config'

export default {
    components: {Timer},
    setup(context){
        const timers = ref([])
        const error = ref(null)

        const timerRefs = []
        const setRef = (el) => {
            timerRefs.push(el)
        }

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

        const handleDelete = (id) => {
            timers.value = timers.value.filter((timer) => {
                return timer.id !== id
            })
        }

        const handleStart = (id) => {
            console.log('handle start in timers.vue')
        }

        const stopAll = () => {
            timerRefs.forEach((item) => {
                if(item.timer.isActive) {
                    item.stopTimer()
                }
            })
        }

        const startAll = () => {
            timerRefs.forEach((item) => {
                if(!item.timer.isActive) {
                    item.startTimer()
                    console.log(item.timer.name)
                }
            })
        }

        const resetAll = () => {
            timerRefs.forEach((item) => {
                if(item.timer.isActive) {
                    item.stopTimer()
                }
            })
        }

    load()

    return {timers, error, load, handleDelete, handleStart, stopAll, startAll, resetAll, timerRefs, setRef}
    }

}
</script>

<style>
    .timers {
        display: flex;
        flex-wrap:   wrap;
    }
</style>