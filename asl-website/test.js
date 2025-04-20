// import { terms } from './constants.js';

const terms = [{term: "BACK"}, {term: "CHEST"}, {term: "HEART"}, {term: "ARM"}, {term: "EARS"}, {term: "HEAD"}, {term: "EYES"}];

const termBtn = document.getElementById('term-btn');
const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');
const recordedVideo = document.getElementById('recordedVideo');

let mediaRecorder;
let recordedChunks = [];
let stream;

async function executePythonScript(blob) {
    const formData = new FormData();
    formData.append('video', blob, 'recorded-video.webm');

    try {
        const response = await fetch('http://localhost:8000/process-video', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();
        console.log("Backend response:", result);

        // store result for access in feedback page
        localStorage.setItem('recognitionResult', JSON.stringify(result));

    } catch (error) {
        console.error("Failed to send video to backend:", error);
    }
}
termBtn.addEventListener('click', () => {
    const randomIndex = Math.floor(Math.random() * terms.length); // randomizes list of terms in module
    const selectedTerm = terms[randomIndex].term; // generates term from list
    document.getElementById("term-display").innerText = selectedTerm;

    // stores tested term in localStorage
    localStorage.setItem('testedTerm', selectedTerm);
});

document.addEventListener('DOMContentLoaded', () => {
    const pageUrl = window.location.href;
    const moduleTitle = pageUrl.substring(pageUrl.lastIndexOf('/') + 1, pageUrl.lastIndexOf('.html')).replace(/-/g, ' ');
    console.log(moduleTitle);

    const buttonItems = JSON.parse(localStorage.getItem('buttonItems')) || [];
    const moduleIndex = buttonItems.findIndex(item => item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '.html' === pageUrl.substring(pageUrl.lastIndexOf('/') + 1));

    if (moduleIndex !== -1) {
        localStorage.setItem(`tested-${moduleIndex}`, 'tested');
    }

    // check if term was previously tested
    const testedTerm = localStorage.getItem('testedTerm');
    if (testedTerm) {
        // remove tested term from terms array
        const termIndex = terms.findIndex(termObj => termObj.term === testedTerm);
        if (termIndex !== -1) {
            terms.splice(termIndex, 1);
        }

        // clear localStorage item
        localStorage.removeItem('testedTerm');
    }
});

startBtn.addEventListener('click', async () => {
    console.log("Start button clicked!");

    try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false }); // gets video permissions
        recordedVideo.srcObject = stream;
        mediaRecorder = new MediaRecorder(stream);

        mediaRecorder.ondataavailable = event => {
            console.log("Video recorded!");
            if (event.data.size > 0) {
                recordedChunks.push(event.data);
            }
        };

        mediaRecorder.onstop = async () => {
            const blob = new Blob(recordedChunks, { type: 'video/webm' }); // uses API to store in blobs
            recordedVideo.src = URL.createObjectURL(blob);
            recordedVideo.controls = true;
            recordedChunks = [];

            const reader = new FileReader();
            reader.onload = function() {
                localStorage.setItem('recordedVideoData', reader.result);
            };
            reader.readAsDataURL(blob);

            await executePythonScript(blob);

            if (stream) {
                const tracks = stream.getTracks();
                tracks.forEach(track => track.stop());
            }
            recordedVideo.srcObject = null;
        
            window.location.replace("./feedback.html");

            try {
                const handle = await window.showSaveFilePicker({
                    suggestedName: 'recorded-video.webm', // creates downloadable file
                    types: [{
                        description: 'WebM video',
                        accept: { 'video/webm': ['.mp4'] },
                    }],
                });
                const writable = await handle.createWritable();
                await writable.write(blob);
                await writable.close();

                console.log('Video saved successfully!');
            } catch (error) {
                if (error.name !== 'AbortError') {
                    console.error('Error saving video:', error);
                }

                const a = document.createElement('a');
                a.href = recordedVideo.src;
                a.download = 'recorded-video.webm';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(recordedVideo.src);
            }

            const tracks = stream.getTracks();
            tracks.forEach(track => track.stop());
            recordedVideo.srcObject = null;

            window.location.replace("./feedback.html"); // redirects to feedback page
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