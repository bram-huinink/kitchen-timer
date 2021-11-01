<template>
  <div class="newTimerContainer">
      <form>
        <label>Name: </label>
        <input type="text">
        <div class="timeForm">
          <label>minutes: </label>
          <input type="number" max="60">
          <label>Seconds: </label>
          <input type="number" max="3">
        </div>
      </form>
  </div>
</template>

<script>
export default {

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

 .timeForm input {
   font-size: 20px;
   padding: 7px 5px;
   width: 50px;
   text-align: center;
   background: #FFF;
   border: solid #E0E0E0 2px;
   border-radius: 5px;
   font-family: monospace;
   margin-right: 15px;
 }
 

 .newTimerContainer label {
   margin-right: 10px;
 }

 .timeForm {
   display: flex;
   align-items: center;
   width: 100%;
 }

</style>