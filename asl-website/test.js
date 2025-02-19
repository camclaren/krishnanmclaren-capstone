import { terms } from './constants.js';

function generateTerm() {
    const randomIndex = Math.floor(Math.random() * terms.length);
    document.getElementById("term-display").innerText = terms[randomIndex].term;
}

const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');
const recordedVideo = document.getElementById('recordedVideo');
let mediaRecorder;
let recordedChunks = [];

startBtn.addEventListener('click', async () => {
    console.log("Start button clicked!");

    try {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        mediaRecorder = new MediaRecorder(stream);

        // Attach event handlers *before* starting the recording
        mediaRecorder.ondataavailable = event => {
            console.log("Data available:", event.data.size);
            if (event.data.size > 0) {
                recordedChunks.push(event.data);
            }
        };

        mediaRecorder.onstop = () => {
            const blob = new Blob(recordedChunks, { type: 'video/webm' });
            recordedVideo.src = URL.createObjectURL(blob);
            recordedVideo.controls = true;
            recordedChunks = [];
        };

        mediaRecorder.onerror = (error) => { // Handle potential errors
            console.error("MediaRecorder error:", error);
            // Optionally display an error message to the user
        };

        mediaRecorder.start();
        console.log("MediaRecorder started. State:", mediaRecorder.state);
        startBtn.disabled = true;  // Disable start button while recording
        stopBtn.disabled = false; // Enable stop button

    } catch (error) {
        console.error("Error accessing media devices:", error);
        // Handle error, e.g., display a message to the user
    }
});

stopBtn.addEventListener('click', () => {
    console.log("Stop button clicked!")
    if (mediaRecorder && mediaRecorder.state === "recording") {
        mediaRecorder.stop();
        startBtn.disabled = false; // Re-enable start button
        stopBtn.disabled = true;  // Disable stop button
    }
});

// Initially disable the stop button
stopBtn.disabled = true;