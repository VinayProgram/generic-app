// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDgIib222wqK1y0FyjekqIhNSMf3nPbAWE",
    authDomain: "yourguidance-1f450.firebaseapp.com",
    projectId: "yourguidance-1f450",
    storageBucket: "yourguidance-1f450.appspot.com",
    messagingSenderId: "859483342493",
    appId: "1:859483342493:web:57bd1505759eb3b5c17674",
    measurementId: "G-BF4TW86EGF"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth= getAuth(app)
export const storage = getStorage(app);
export const provider = new GoogleAuthProvider();