const terms = [
    'ARM',
    'BACK',
    'CHEST',
    'EARS',
    'EYES',
    'HEAD',
    'JAW',
    'LEGS',
    'NOSE',
    'RIBS',
    'STOMACH',
    'THROAT'
];

function generateTerm() {
    const randomIndex = Math.floor(Math.random() * terms.length);
    document.getElementById("term-display").innerText = terms[randomIndex];
}

function goToGradio() {
    window.location.href = "https://your-gradio-app-link.com"; // Change this to your Gradio app URL
}