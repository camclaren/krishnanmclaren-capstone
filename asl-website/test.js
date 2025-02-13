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

function goToGradio() {
    window.location.href = "https://your-gradio-app-link.com"; // Change this to your Gradio app URL
}