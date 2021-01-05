var firebase = require("firebase/app");
require("firebase/database");

const config = {
  apiKey: "*",
  authDomain: "*",
  databaseURL: "*",
  projectId: "*",
  storageBucket: "*",
  messagingSenderId: "*",
  appId: "*"
}

firebase.initializeApp(config);

const usersRef = firebase.database().ref().child('users')
const mediaRef = firebase.database().ref().child('media')
const logsRef = firebase.database().ref().child('logs')

export { usersRef, mediaRef, logsRef }