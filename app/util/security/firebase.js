// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.PUBLIC_FIREBASE_AUTH_DOMAIN ,
  databaseURL: process.env.PUBLIC_FIREBASE_DATABASE_URL ,
  projectId: process.env.PUBLIC_FIREBASE_PROJECT_ID ,
  storageBucket: process.env.PUBLIC_FIREBASE_STORAGE_BUCKET ,
  messagingSenderId: process.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID ,
  appId: process.env.PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);