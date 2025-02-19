import {terms} from './constants.js';

function generateTerm() {
    const randomIndex = Math.floor(Math.random() * terms.length);
    document.getElementById("term-display").innerText = terms[randomIndex].term;
}

const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const recordedVideo = document.getElementById('recordedVideo');
let mediaRecorder;
let recordedChunks = [];

startBtn.addEventListener('click', async () => {
    const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = event => {
        if (event.data.size > 0) {
            recordedChunks.push(event.data);
        }
    };

    mediaRecorder.onstop = () => {  // Move onstop handler *inside* the click listener
        const blob = new Blob(recordedChunks, { type: 'video/webm' });
        recordedVideo.src = URL.createObjectURL(blob);
        recordedVideo.controls = true; // Add controls so the user can play/pause
        recordedChunks = [];
    };

    mediaRecorder.start();
});

stopBtn.addEventListener('click', () => {
    if (mediaRecorder && mediaRecorder.state === "recording") { // Check if mediaRecorder exists and is recording
        mediaRecorder.stop();
    }
});