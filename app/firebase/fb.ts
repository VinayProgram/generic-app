// Import the functions you need from the SDKs
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Import Firebase secrets from environment variables
import { 
  REACT_NATIVE_FIREBASE_API_KEY,
  REACT_NATIVE_FIREBASE_AUTH_DOMAIN,
  REACT_NATIVE_FIREBASE_PROJECT_ID,
  REACT_NATIVE_FIREBASE_STORAGE_BUCKET,
  REACT_NATIVE_FIREBASE_MESSAGING_SENDER_ID,
  REACT_NATIVE_FIREBASE_APP_ID,
  REACT_NATIVE_FIREBASE_MEASUREMENT_ID
} from '@/constants/secrets';

// Firebase configuration using environment variables
const firebaseConfig = {
  apiKey: REACT_NATIVE_FIREBASE_API_KEY,
  authDomain: REACT_NATIVE_FIREBASE_AUTH_DOMAIN,
  projectId: REACT_NATIVE_FIREBASE_PROJECT_ID,
  storageBucket: REACT_NATIVE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: REACT_NATIVE_FIREBASE_MESSAGING_SENDER_ID,
  appId: REACT_NATIVE_FIREBASE_APP_ID,
  measurementId: REACT_NATIVE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const provider = new GoogleAuthProvider();
