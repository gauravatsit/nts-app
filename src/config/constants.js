import firebase from 'firebase'

const config = {
    apiKey: "AIzaSyCeZYZohftBoeAOJsY_neYU82qaoC3jmIo",
    authDomain: "nts-app-141fe.firebaseapp.com",
    databaseURL: "https://nts-app-141fe.firebaseio.com",
    projectId: "nts-app-141fe",
    storageBucket: "nts-app-141fe.appspot.com",
    messagingSenderId: "913745438259"
};

firebase.initializeApp(config);

export const googleProvider = new firebase.auth.GoogleAuthProvider();
export const fbdb = firebase.database();
export const firebaseAuth = firebase.auth;