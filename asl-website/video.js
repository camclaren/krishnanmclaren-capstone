import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Get term from URL query parameters
const params = new URLSearchParams(window.location.search);
const term = params.get('term');

// Reference to your Firebase Realtime Database (replace with your actual config)
const db = firebase.database(); // Assuming you've initialized Firebase

// Function to fetch video URL from Firebase
function getVideoUrlFromFirebase(term, callback) {
  const termRef = db.ref(`videos/${term.toUpperCase()}`); // Path in your database

  termRef.once('value', (snapshot) => {
    const videoUrl = snapshot.val(); // Get the value (URL) at that path
    callback(videoUrl); // Call the callback with the URL
  }, (error) => {
    console.error("Error fetching video:", error);
    callback(null); // Call the callback with null to indicate an error
  });
}

if (term) {
  getVideoUrlFromFirebase(term, (videoUrl) => {
    if (videoUrl) {
      document.getElementById('term-title').innerText = term.toUpperCase();
      document.getElementById('term-video').src = videoUrl;
      console.log("Video loaded successfully from Firebase!");
    } else {
      document.getElementById('term-title').innerText = 'Video not found';
      console.log("Video not found in Firebase :(");
    }
  });
} else {
  document.getElementById('term-title').innerText = 'No term specified';
  console.log("No term provided in URL.");
}


// Example of how to structure your Firebase data:
// "videos": {
//   "ARM": "gs://your-bucket/arm_rutgers.mp4", // Or the actual URL
//   "BACK": "gs://your-bucket/back_rutgers.mp4",
//   "CHEST": "gs://your-bucket/chest_rutgers.mp4",
//   // ... other terms
// }

/*
// get term from URL query parameters
const params = new URLSearchParams(window.location.search);
const term = params.get('term');

// load video based on term
const terms = {
    'ARM': './term-videos/arm_rutgers.mp4',
    'BACK': 'back_rutgers.mp4',
    'CHEST': 'chest_rutgers.mp4',
    'EARS': 'video2.mp4',
    'EYES': 'video1.mp4',
    'HEAD': 'head_rutgers.mp4',
    'JAW': 'video1.mp4',
    'KNEES': 'video2.mp4',
    'NOSE': 'video1.mp4',
    'RIBS': 'video2.mp4',
    'STOMACH': 'video1.mp4',
    'THROAT': 'video2.mp4'
};
*/

if (term && terms[term.toUpperCase()]) {
    document.getElementById('term-title').innerText = term.toUpperCase();
    document.getElementById('term-video').src = terms[term.toUpperCase()];
    console.log("success!");
} else {
    document.getElementById('term-title').innerText = 'Video not found';
    console.log("not found :(");
}