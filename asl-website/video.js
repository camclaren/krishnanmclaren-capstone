// get term from URL query parameters
const params = new URLSearchParams(window.location.search);
const term = params.get('term');

// load video based on term
const terms = {
    'ARM': 'arm_rutgers.mp4',
    'BACK': 'back_rutgers.mp4',
    'CHEST': 'chest_rutgers.mp4',
    'EARS': 'video2.mp4',
    'EYES': 'video1.mp4',
    'HEAD': 'head_rutgers.mp4',
    'JAW': 'video1.mp4',
    'KNEES': 'video2.mp4',
    'NOSE': 'video1.mp4',
    'RIBS': 'video2.mp4',
    'STOMACH': 'video1.mp4',
    'THROAT': 'video2.mp4'
};

if (term && terms[term.toUpperCase()]) {
    document.getElementById('term-title').innerText = term.toUpperCase();
    document.getElementById('term-video').src = terms[term.toUpperCase()];
    console.log("success!");
} else {
    document.getElementById('term-title').innerText = 'Video not found';
    console.log("not found :(");
}