<template>
  <header>
    <h1>Kitchen Timer</h1>
    <router-link to="/">Home</router-link>
    <router-link :to="{name: 'New'}">New Timer</router-link>
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons"
      rel="stylesheet">
  </header>
  <router-view/>
</template>

<style>
html {
  background: #F5F5F5;
  font-family: Effra, Arial, sans-serif;
}

body {
  margin: 30px;
}

header {
  margin: 30px auto;
  display: block;
}

header a {
  padding: 15px 20px;
  background: #FFF;
  text-decoration: none;
  color: #000;
  border-radius: 40px;
  margin: 0px 10px;
  border: solid #E0E0E0 2px;
  transition-duration: 0.3s;
}

header a:hover {
  -webkit-box-shadow: 0px 1px 11px 0px rgba(0,0,0,0.16); 
  box-shadow: 0px 1px 11px 0px rgba(0,0,0,0.16);
}

header h1 {
  margin-bottom: 30px;
}
</style>
