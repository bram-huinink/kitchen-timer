<template>
  <div class="newTimerContainer">
      <form @submit.prevent="handleSubmit">
        <h2>Create a new timer</h2>
        <label>Name: </label>
        <input v-model="name" type="text" required>
        <div class="timeForm">
          <label>Minutes: </label>
          <input v-model="minutes" type="number" max="60" min="0" required>
          <label>Seconds: </label>
          <input v-model="seconds" type="number" max="59" min="0" required>
        </div>
        <button type="submit">Create timer</button>
        <button @click.prevent="handleCancel" >Cancel</button>
      </form>
  </div>
</template>

<script>
import {useRouter} from 'vue-router'
import {ref} from 'vue'
import {projectFirestore} from '../firebase/config'

export default {
  setup(){

    const name = ref(null)
    const minutes = ref(null)
    const seconds = ref(null)
    
    const router = useRouter()

    const handleCancel = () => {
      router.push('/')
    }

    const handleSubmit = async () => {
      let data = { 
        name: name.value,
        minutes: minutes.value,
        seconds: seconds.value,
      }
      const res = await projectFirestore.collection('timers').add(data)
      router.push('/')
    }
    return { handleCancel, handleSubmit, name, minutes, seconds}
  }
}
</script>

<style>
.newTimerContainer {
    padding: 15px 30px;
    background: #FFF;
    border-radius: 25px;
    border: solid #E0E0E0 2px;
    text-align: center;
    margin: 10px;
    width: 400px;
    text-align: left;
}

 .newTimerContainer input {
   padding: 7px 5px;
   text-align: center;
   background: #FFF;
   border: solid #E0E0E0 2px;
   border-radius: 5px;
   font-family: monospace;
   margin-right: 15px;
 }

 .timeForm input {
   width: 50px;
 }
 

 .newTimerContainer label {
   margin-right: 10px;
 }

 .timeForm {
   display: flex;
   align-items: center;
   width: 100%;
   margin-top: 20px;
   margin-bottom: 40px;
 }

</style>