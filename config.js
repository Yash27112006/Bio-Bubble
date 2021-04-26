import firebase from 'firebase'
require('@firebase/firestore')

  var firebaseConfig = {
    apiKey: "AIzaSyDqKqr4fSDtDB7E6mEp5an4m9Dt9iWXbOI",
    authDomain: "bio-bubble.firebaseapp.com",
    projectId: "bio-bubble",
    storageBucket: "bio-bubble.appspot.com",
    messagingSenderId: "1064179029170",
    appId: "1:1064179029170:web:ee4e0d6a3a9ef2de3565ab"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  export default firebase.firestore();