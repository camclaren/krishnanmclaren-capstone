import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore"; //  using Firestore

const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID",
    measurementId: "YOUR_MEASUREMENT_ID"
};

// initializing Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getFirestore(app); // for using Firestore

import { ref, getDownloadURL } from "firebase/storage";

const fetchVideo = async (videoPath) => {
    const videoRef = ref(storage, videoPath);
    try {
        const url = await getDownloadURL(videoRef);
        return url; //video display
    } catch (error) {
        console.error("Error fetching video:", error);
    }
};