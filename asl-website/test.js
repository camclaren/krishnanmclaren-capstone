import { terms } from './constants.js';

// sets variables to corresponding buttons in html script
const termBtn = document.getElementById('term-btn');

const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');
const recordedVideo = document.getElementById('recordedVideo');

let mediaRecorder; // holds object mediaRecorder
let recordedChunks = []; // stores recorded video in chunks
let stream; // stores media from the camera stream, outside event listener so it can be accessed later

// add event listener (make sure the button with id="generateTermButton" exists)
termBtn.addEventListener('click', () => {
    const randomIndex = Math.floor(Math.random() * terms.length); // randomly generates index in list
    document.getElementById("term-display").innerText = terms[randomIndex].term; // outputs corresponding term
});

startBtn.addEventListener('click', async () => {
    console.log("Start button clicked!");

    try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false }); // get user media permissions (only need video)

        recordedVideo.srcObject = stream; // set the video element to display the stream

        mediaRecorder = new MediaRecorder(stream);

        mediaRecorder.ondataavailable = event => {
            console.log("Video recorded!");
            if (event.data.size > 0) {
                recordedChunks.push(event.data);
            }
        };

        mediaRecorder.onstop = () => {
            const blob = new Blob(recordedChunks, { type: 'video/webm' });
            recordedVideo.src = URL.createObjectURL(blob);
            recordedVideo.controls = true; // show video controls after recording
            recordedChunks = [];

            // stop all tracks of the stream to release the camera
            const tracks = stream.getTracks();
            tracks.forEach(track => track.stop());
            recordedVideo.srcObject = null; // release the camera from the video element.
        };

        mediaRecorder.onerror = (error) => {
            console.error("MediaRecorder error:", error);
        };

        mediaRecorder.start();
        console.log("MediaRecorder started. State:", mediaRecorder.state);
        startBtn.disabled = true;
        stopBtn.disabled = false;

    } catch (error) {
        console.error("Error accessing media devices:", error);
    }
});

stopBtn.addEventListener('click', () => {
    console.log("Stop button clicked!")
    if (mediaRecorder && mediaRecorder.state === "recording") {
        mediaRecorder.stop();
        startBtn.disabled = false;
        stopBtn.disabled = true;
    }
});

stopBtn.disabled = true;