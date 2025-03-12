import {terms} from './contstants.js';


document.getElementById('term-title').innerText = "Good job!";
document.getElementById('term-video').src = terms[1];

const displayVideo = document.getElementById('displayVideo');
const recordedVideoData = localStorage.getItem('recordedVideoData');

if (recordedVideoData) {
    displayVideo.src = recordedVideoData;
} else {
    alert('No recorded video found.');
}

console.log("success!");
