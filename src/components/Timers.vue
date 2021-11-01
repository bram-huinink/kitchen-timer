<template>
    <div class="timers">
        <Timer 
        v-for="timer in timers"
        :key="timer.name"
        :timer="timer"
        @delete="handleDelete"
        />
    </div>
</template>

<script>
import { ref } from 'vue'
import Timer from './Timer.vue'

export default {
    components: {Timer},
    setup(){
        const timers = ref([])
        const error = ref(null)

        const load = async () => {
            try{
                let data = await fetch('http://localhost:3000/timers')
                if(!data.ok){
                    throw Error('no data available')
                }
                timers.value = await data.json()
            } catch(err){
                error.value = err.message
                console.log(error.value)
            }
        }

        const handleDelete = (name) => {
            timers.value = timers.value.filter((timer) => {
                return timer.name !== name
            })
        }

    load()

    return {timers, error, load, handleDelete }
    }

}
</script>

<style>
    .timers {
        display: flex;
        flex-wrap:   wrap;
    }
</style>