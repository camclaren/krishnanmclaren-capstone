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

var videoElement = document.querySelector('video');
var audioSelect = document.querySelector('select#audioSource');
var videoSelect = document.querySelector('select#videoSource');

audioSelect.onchange = getStream;
videoSelect.onchange = getStream;

getStream().then(getDevices).then(gotDevices);

function getDevices() {
  // AFAICT in Safari this only gets default devices until gUM is called :/
  return navigator.mediaDevices.enumerateDevices();
}

function gotDevices(deviceInfos) {
  window.deviceInfos = deviceInfos; // make available to console
  console.log('Available input and output devices:', deviceInfos);
  for (const deviceInfo of deviceInfos) {
    const option = document.createElement('option');
    option.value = deviceInfo.deviceId;
    if (deviceInfo.kind === 'videoinput') {
      option.text = deviceInfo.label || `Camera ${videoSelect.length + 1}`;
      videoSelect.appendChild(option);
    }
  }
}

function getStream() {
  if (window.stream) {
    window.stream.getTracks().forEach(track => {
      track.stop();
    });
  }
  const audioSource = audioSelect.value;
  const videoSource = videoSelect.value;
  const constraints = {
    video: {deviceId: videoSource ? {exact: videoSource} : undefined}
  };
  return navigator.mediaDevices.getUserMedia(constraints).
    then(gotStream).catch(handleError);
}

function gotStream(stream) {
  window.stream = stream; // make stream available to console
  videoSelect.selectedIndex = [...videoSelect.options].
    findIndex(option => option.text === stream.getVideoTracks()[0].label);
  videoElement.srcObject = stream;
}

function handleError(error) {
  console.error('Error: ', error);
}

function goToGradio() {
    window.location.href = "https://your-gradio-app-link.com"; // Change this to your Gradio app URL
}