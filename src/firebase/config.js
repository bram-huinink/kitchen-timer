import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyAI1rlEt5JLk2vxTlnoCwCgdZ-VM4qHOEc",
    authDomain: "kitchen-timer-c338f.firebaseapp.com",
    projectId: "kitchen-timer-c338f",
    storageBucket: "kitchen-timer-c338f.appspot.com",
    messagingSenderId: "1098766532480",
    appId: "1:1098766532480:web:fdb2130f804419edf60b65"
  };

  // init firebase
  firebase.initializeApp(firebaseConfig)

  // init firestore service
  const projectFirestore = firebase.firestore()

  export {projectFirestore}