// Import Firebase SDK modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
    getAuth,
    signInWithEmailAndPassword,
    connectAuthEmulator
} from 'firebase/auth';

// Your Firebase configuration (Replace with your actual Firebase project config)
const firebaseConfig = {
    apiKey: "AIzaSyBcACB5JesPs0X6Pz48yd76PIxbuy_j7q0",
    authDomain: "asl-learning-app-4a237.firebaseapp.com",
    projectId: "asl-learning-app-4a237",
    storageBucket: "asl-learning-app-4a237.firebasestorage.app",
    messagingSenderId: "642971879399",
    appId: "1:642971879399:web:ac0c91008c0eaaa48a9f42",
    measurementId: "G-6R6RM8H0V5"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);

console.log("Firebase Config Loaded Successfully");

// Export Firebase instances for use in other files
export { auth, storage, ref, getDownloadURL };

