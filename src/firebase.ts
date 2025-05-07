import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyDDI7lxv6Yms-EQ7Qwl22GEoDsYPl7iW-w",
  authDomain: "lumora-online-journal.firebaseapp.com",
  projectId: "lumora-online-journal",
  storageBucket: "lumora-online-journal.firebasestorage.app",
  messagingSenderId: "409145348002",
  appId: "1:409145348002:web:e1e28748919c11340f2cfb",
  measurementId: "G-WML1L2ZCLB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);