<template>
    <div class="timerBlock">
        <h2>{{ timer.name }}</h2>
        <p>Time:</p>
        <p class="time">{{ timer.minutes }}:{{ timer.seconds }}</p>
        <button>Start</button>
        <button @click="deleteTimer">Delete</button>
    </div>
</template>

<script>
export default {
    props: ['timer'],
    setup(props, context){
        const uri = 'http://localhost:3000/timers/' + props.timer.id

        const deleteTimer = () => {
            fetch(uri, {method: 'DELETE'})
            .then(() => context.emit('delete', props.timer.name))
            .catch(err => console.log(err))
        }

        return {deleteTimer, uri}
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
            width: 200px;
            margin: 10px;
    }

    .timerBlock button {
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

</style>