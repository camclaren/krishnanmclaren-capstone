// import { terms } from './constants.js';

const terms = [{term: "BACK"}, {term: "CHEST"}, {term: "HEART"}, {term: "ARM"}, {term: "EARS"}, {term: "HEAD"}, {term: "EYES"}];

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

        mediaRecorder.onstop = async () => {
            const blob = new Blob(recordedChunks, { type: 'video/webm' });
            recordedVideo.src = URL.createObjectURL(blob);
            recordedVideo.controls = true; // show video controls after recording
            recordedChunks = [];

            const reader = new FileReader();
            reader.onload = function() {
                localStorage.setItem('recordedVideoData', reader.result);
            };
            reader.readAsDataURL(blob);

            try {
                // use showSaveFilePicker to allow user to choose download location
                const handle = await window.showSaveFilePicker({
                    suggestedName: 'recorded-video.webm',
                    types: [{
                        description: 'WebM video',
                        accept: { 'video/webm': ['.webm'] },
                    }],
                });
                const writable = await handle.createWritable();
                await writable.write(blob);
                await writable.close();

                console.log('Video saved successfully to user-selected location.');
            } catch (error) {
                // user likely cancelled the save dialog, or an error occurred
                if (error.name !== 'AbortError') { // AbortError is expected when user cancels
                    console.error('Error saving video:', error);
                }

                // fallback to downloading in the browser's default download location.
                const a = document.createElement('a');
                a.href = recordedVideo.src;
                a.download = 'recorded-video.webm'; // set filename
                document.body.appendChild(a);
                a.click(); // click to trigger download
                document.body.removeChild(a); // remove link element
                URL.revokeObjectURL(recordedVideo.src); // release URL
            }

            // stop all tracks of stream to release camera
            const tracks = stream.getTracks();
            tracks.forEach(track => track.stop());
            recordedVideo.srcObject = null; // release camera from video element

            window.location.replace("./feedback.html");
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