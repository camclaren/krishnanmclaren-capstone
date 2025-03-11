// Import Firebase SDK modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Your Firebase configuration (Replace with your actual Firebase project config)
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

console.log("✅ Firebase Config Loaded Successfully");

// Export Firebase instances for use in other files
export { auth, db };

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