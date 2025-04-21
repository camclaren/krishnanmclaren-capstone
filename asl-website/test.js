const terms = [{term: "BACK"}, {term: "CHEST"}, {term: "HEART"}, {term: "ARM"}, {term: "EARS"}, {term: "HEAD"}, {term: "EYES"}];

const termBtn = document.getElementById('term-btn');
const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');
const submitBtn = document.getElementById('submit-btn');
const recordedVideo = document.getElementById('recordedVideo');

let mediaRecorder;
let recordedChunks = [];
let stream;
fetch('http://localhost:8000/auth')
    .then(res => res.json())
    .then(data => console.log('Auth response:', data))
    .catch(err => console.error('Auth error:', err));

fetch('http://localhost:8000/videohandler')
    .then(res => res.json())
    .then(data => console.log('Video handler response:', data))
    .catch(err => console.error('Video handler error:', err));

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
            recordedVideo.src = URL.createObjectURL(blob); // creates temp URL for user to view playback
            recordedVideo.controls = true;
            recordedChunks = [];

            const reader = new FileReader();
            reader.onload = function() {
                localStorage.setItem('recordedVideoData', reader.result);
            };
            reader.readAsDataURL(blob);
           
            try {
                const handle = await window.showSaveFilePicker({ // user is prompted with where they would like to save file
                    suggestedName: 'recorded-video.webm', // creates downloadable file
                    types: [{
                        description: 'WebM video',
                        accept: { 'video/webm': ['.mp4'] },
                    }],
                });
                const writable = await handle.createWritable();
                await writable.write(blob);
                await writable.close();

                const a = document.createElement('a');
                a.href = recordedVideo.src;
                a.download = 'recorded-video.webm';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(recordedVideo.src);

                console.log('Video saved successfully!');
            } catch (error) {
                if (error.name !== 'AbortError') {
                    console.error('Error saving video:', error);
                }
            }


            await executePythonScript(blob);

            if (stream) {
                const tracks = stream.getTracks();
                tracks.forEach(track => track.stop());
            }
            recordedVideo.srcObject = null;
        
            window.location.replace("./feedback.html");

            const tracks = stream.getTracks();
            tracks.forEach(track => track.stop());
            recordedVideo.srcObject = null;
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

document.addEventListener('DOMContentLoaded', async() => {

    const submitBtn = document.getElementById('submit-btn');
    if (submitBtn) {
        submitBtn.addEventListener('click', async () => {
            console.log("Submit button clicked!");

            await executePythonScript(); // make sure to await if it's async

            window.location.replace("./feedback.html");
        });
    } else {
        console.error("Submit button not found!");
    }
});