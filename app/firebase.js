// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBKRS9sJ2rKuBTR8clKwWhsvXKZcegMjkc",
    authDomain: "diamond-valley-cattery-web-app.firebaseapp.com",
    databaseURL: "https://diamond-valley-cattery-web-app-default-rtdb.firebaseio.com",
    projectId: "diamond-valley-cattery-web-app",
    storageBucket: "diamond-valley-cattery-web-app.appspot.com",
    messagingSenderId: "998252955755",
    appId: "1:998252955755:web:0d7cf56b0a6c12d7adc92e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db}
