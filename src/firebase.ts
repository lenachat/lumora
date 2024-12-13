import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyANkMfb2xU6jTYgTtqgnvyZeen329JvhLk",
  authDomain: "yournal-fbc1c.firebaseapp.com",
  projectId: "yournal-fbc1c",
  storageBucket: "yournal-fbc1c.firebasestorage.app",
  messagingSenderId: "801282006075",
  appId: "1:801282006075:web:418754fd3a0325b5bfd01e",
  measurementId: "G-GWKZZ244MB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);