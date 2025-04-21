const terms = [{term: "BACK"}, {term: "CHEST"}, {term: "HEART"}, {term: "ARM"}, {term: "EARS"}, {term: "HEAD"}, {term: "EYES"}];

const termBtn = document.getElementById('term-btn');
const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');
const submitBtn = document.getElementById('submit-btn');
const recordedVideo = document.getElementById('recordedVideo');

let mediaRecorder;
let recordedChunks = [];
let stream;

fetch('http://localhost:3000/auth')
  .then(async res => {
    if (!res.ok) {
      throw new Error(`HTTP error ${res.status}`);
    }
    return res.json();
  })
  .then(data => console.log('Auth response:', data))
  .catch(err => console.error('Auth error:', err));

  fetch('http://localhost:3000/videohandler')
  .then(async res => {
    if (!res.ok) {
      throw new Error(`HTTP error ${res.status}`);
    }
    return res.json();
  })
  .then(data => console.log('Video handler response:', data))
  .catch(err => console.error('Video handler error:', err));

async function executePythonScript() {
    // Safety check to make sure there's an actual video blob
    if (!blob || blob.size === 0) {
        console.warn("No video data available. Skipping backend call.");
        return;
    }

    const formData = new FormData();
    formData.append('video', blob, 'recorded-video.webm');

    try {
        const response = await fetch('http://localhost:3000/process-video', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log("Backend response:", result);

        // Store result for access in feedback page
        localStorage.setItem('recognitionResult', JSON.stringify(result));

    } catch (error) {
        console.error("Failed to send video to backend:", error);
    }
}

termBtn.addEventListener('click', () => {
    const randomIndex = Math.floor(Math.random() * terms.length);
    const selectedTerm = terms[randomIndex].term;
    document.getElementById("term-display").innerText = selectedTerm;
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

    const testedTerm = localStorage.getItem('testedTerm');
    if (testedTerm) {
        const termIndex = terms.findIndex(termObj => termObj.term === testedTerm);
        if (termIndex !== -1) {
            terms.splice(termIndex, 1);
        }
        localStorage.removeItem('testedTerm');
    }
});

startBtn.addEventListener('click', async () => {
    console.log("Start button clicked!");

    try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        recordedVideo.srcObject = stream;
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
            recordedVideo.controls = true;
            recordedChunks = [];

            const reader = new FileReader();
            reader.onload = function() {
                localStorage.setItem('recordedVideoData', reader.result);
            };
            reader.readAsDataURL(blob);

            try {
                const handle = await window.showSaveFilePicker({
                    suggestedName: 'recorded-video.webm',
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
            }

            await executePythonScript(blob);

            if (stream) {
                const tracks = stream.getTracks();
                tracks.forEach(track => track.stop());
            }
            recordedVideo.srcObject = null;
          //  window.location.replace("./feedback.html");
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
    console.log("Stop button clicked!");
    if (mediaRecorder && mediaRecorder.state === "recording") {
        mediaRecorder.stop();
        startBtn.disabled = false;
        stopBtn.disabled = true;
    }
});

stopBtn.disabled = true;

submitBtn.addEventListener('click', async () => {
    console.log("Submit button clicked!");

    const result = await executePythonScript();

    if (result && result.success) {
        try {
            const response = await fetch('http://localhost:3000/videohandler');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const data = await response.json();
            console.log("Video handler response:", data);

            window.location.replace("./feedback.html");
        } catch (err) {
            console.error("Video handler error:", err);
        }
    } else {
        console.error("Python script did not complete successfully.");
    }
});
