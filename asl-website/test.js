const terms = [
    'ARM',
    'BACK',
    'CHEST',
    'EARS',
    'EYES',
    'HEAD',
    'HEART',
    'JAW',
    'LEGS',
    'LUNGS',
    'NOSE',
    'RIBS',
    'STOMACH',
    'THROAT',
    'WRIST',
    'SCRAPE',
    'STAB',
    'STITCH',
    'CUT',
    'BURN',
    'DIZZY',
    'FAINT',
    'HEADACHE',
    'ITCH',
    'STOMACH CRAMPS',
    'ALCOHOL',
    'COCAINE',
    'DRUG',
    'MARIJUANA',
    'OVERDOSE'
];

function generateTerm() {
    const randomIndex = Math.floor(Math.random() * terms.length);
    document.getElementById("term-display").innerText = terms[randomIndex];
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

    mediaRecorder.start();
});

stopBtn.addEventListener('click', () => {
    mediaRecorder.stop();
});

mediaRecorder.onstop = () => {
    const blob = new Blob(recordedChunks, { type: 'video/webm' });
    recordedVideo.src = URL.createObjectURL(blob);
    recordedChunks = [];
};