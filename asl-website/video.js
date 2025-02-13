// get term from URL query parameters
const params = new URLSearchParams(window.location.search);
const term = params.get('term');

// load video based on term
const terms = {
    'ARM': 'arm_rutgers.mp4',
    'BACK': 'back_rutgers.mp4',
    'CHEST': 'chest_rutgers.mp4',
    'EARS': 'ear.mp4',
    'EYES': 'eyes_rutgers.mp4',
    'HEAD': 'head_rutgers.mp4',
    'HEART': 'heart_rutgers.mp4',
    'JAW': 'jaw_rutgers.mp4',
    'LEGS': 'legs_rutgers.mp4',
    'LUNGS': 'lungs_rutgers.mp4',
    'NOSE': 'nose_rutgers.mp4',
    'RIBS': 'ribs_rutgers.mp4',
    'STOMACH': 'stomach_rutgers.mp4',
    'THROAT': 'throat_rutgers.mp4',
    'WRIST': 'wrist_rutgers.mp4',
    'SCRAPE': 'scrape_rutgers.mp4',
    'STAB': 'stab_rutgers.mp4',
    'STITCH': 'stitch_rutgers.mp4',
    'CUT': 'cut_rutgers.mp4',
    'BURN': 'burn_rutgers.mp4',
    'DIZZY': 'dizzy_rutgers.mp4',
    'FAINT': 'faint_rutgers.mp4',
    'HEADACHE': 'headache_rutgers.mp4',
    'ITCH': 'itch_rutgers.mp4',
    'STOMACH CRAMPS': 'stomachcramps_rutgers.mp4',
    'ALCOHOL': 'alcohol_rutgers.mp4',
    'COCAINE': 'cocaine_rutgers.mp4',
    'DRUG': 'drug_rutgers.mp4',
    'MARIJUANA': 'marijuana_rutgers.mp4',
    'OVERDOSE': 'overdose_rutgers.mp4'
    
};

if (term && terms[term.toUpperCase()]) {
    document.getElementById('term-title').innerText = term.toUpperCase();
    document.getElementById('term-video').src = terms[term.toUpperCase()];
    console.log("success!");
} else {
    document.getElementById('term-title').innerText = 'Video not found';
    console.log("not found :(");
}