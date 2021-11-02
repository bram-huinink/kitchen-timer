<template>
    <div class="timers">
        <Timer 
        v-for="timer in timers"
        :key="timer.name"
        :timer="timer"
        @delete="handleDelete"
        @start="handleStart"
        />
    </div>
</template>

<script>
import { ref } from 'vue'
import Timer from './Timer.vue'
import { projectFirestore } from '../firebase/config'

export default {
    components: {Timer},
    setup(){
        const timers = ref([])
        const error = ref(null)
        const load = async () => {
            try{
                const res = await projectFirestore.collection('timers').get()
                timers.value = res.docs.map(doc => {
                    return { ...doc.data(), id: doc.id }
                })
                console.log(timers.value)
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

    load()

    return {timers, error, load, handleDelete, handleStart }
    }

}
</script>

<style>
    .timers {
        display: flex;
        flex-wrap:   wrap;
    }
</style>