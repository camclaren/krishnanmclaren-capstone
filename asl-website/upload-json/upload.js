const admin = require("firebase-admin");
const fs = require("fs");

// Initialize Firebase Admin SDK  --> NEED TO UPDATE WITH NEW KEY
const serviceAccount = require("C:\Users\calyp\Downloads\capstone-terms-database-firebase-adminsdk-fbsvc-adb0f8c72f.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://your-project-id.firebaseio.com"
});

const db = admin.firestore();

// Read JSON file
const data = JSON.parse(fs.readFileSync("video-metadata.json", "utf8"));

// Upload to Firestore
const uploadData = async () => {
  const collectionName = "asl-website"; // Change to your collection name
  const batch = db.batch();

  data.forEach((item, index) => {
    const docRef = db.collection(collectionName).doc(); // Auto-generate ID
    batch.set(docRef, item);
  });

  await batch.commit();
  console.log("Data uploaded successfully!");
};

uploadData().catch((error) => {
  console.error("Error uploading data:", error);
});


/* i got this from the firebase website when i generated the database

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCvaZAtWvZwt5TTseaJisj6jLbmZNTSOrE",
  authDomain: "krishnanmclaren-capstone.firebaseapp.com",
  projectId: "krishnanmclaren-capstone",
  storageBucket: "krishnanmclaren-capstone.firebasestorage.app",
  messagingSenderId: "563765776120",
  appId: "1:563765776120:web:2818caa0a0dc78101db50d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
*/