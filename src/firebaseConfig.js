// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAKMG9-pYlPEhvEEhY6OuLQDWccjIxallc",
  authDomain: "market-feefe.firebaseapp.com",
  projectId: "market-feefe",
  storageBucket: "market-feefe.appspot.com",
  messagingSenderId: "290543257494",
  appId: "1:290543257494:web:166f2374dfb96fed63bfb7",
  measurementId: "G-QT45S8KB84",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
