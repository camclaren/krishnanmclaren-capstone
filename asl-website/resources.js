const terms = [
    { term: 'ARM', video: 'arm_rutgers.mp4' },
    { term: 'BACK', video: 'back_rutgers.mp4' },
    { term: 'CHEST', video: 'chest_rutgers.mp4' },
    { term: 'EARS', video: 'ear.mp4' },
    { term: 'EYES', video: 'eyes_rutgers.mp4' },
    { term: 'HEAD', video: 'head_rutgers.mp4' },
    { term: 'JAW', video: 'jaw_rutgers.mp4' },
    { term: 'KNEES', video: 'knees_rutgers.mp4' },
    { term: 'NOSE', video: 'nose_rutgers.mp4' },
    { term: 'RIBS', video: 'ribs_rutgers.mp4' },
    { term: 'STOMACH', video: 'stomach_rutgers.mp4' },
    { term: 'THROAT', video: 'throat_rutgers.mp4' },
    { term: 'SCRAPE', video: 'scrape_rutgers.mp4' },
    { term: 'STAB', video: 'stab_rutgers.mp4' },
    { term: 'STITCH', video: 'stitch_rutgers.mp4' },
    { term: 'CUT', video: 'cut_rutgers.mp4' },
    { term: 'BURN', video: 'burn_rutgers.mp4' },
    { term: 'DIZZY', video: 'dizzy_rutgers.mp4' },
    { term: 'FAINT', video: 'faint_rutgers.mp4' },
    { term: 'HEADACHE', video: 'headache_rutgers.mp4' },
    { term: 'ITCH', video: 'itch_rutgers.mp4' },
    { term: 'STOMACH CRAMPS', video: 'stomachcramps_rutgers.mp4' },
    { term: 'PANIC', video: 'panic_rutgers.mp4' },
    { term: 'RASH', video: 'rash_rutgers.mp4' },
    { term: 'SWEATING', video: 'sweating_rutgers.mp4' },
    { term: 'SWELLING', video: 'swelling_rutgers.mp4' },
    { term: 'VOMIT', video: 'vomit_rutgers.mp4' },
    { term: 'ALCOHOL', video: 'alcohol_rutgers.mp4' },
    { term: 'COCAINE', video: 'cocaine_rutgers.mp4' },
    { term: 'DRUG', video: 'drug_rutgers.mp4' },
    { term: 'MARIJUANA', video: 'marijuana_rutgers.mp4' },
    { term: 'OVERDOSE', video: 'overdose_rutgers.mp4' }

];

function search_term() {
    const input = document.getElementById('searchbar').value.toLowerCase(); // gets input from search bar
    const searchResults = document.getElementById('search-results'); // what's outputted in drop-down results

    searchResults.innerHTML = ''; // clear previous results
    searchResults.style.display = 'none'; // hide dropdown when you're not searching

    if (input.trim() === '') {
        return; // do nothing if input is empty
    }

    // filter terms based on what matches input (to be put in list below)
    const matches = terms.filter(item => item.term.toLowerCase().includes(input));

    // display matches in the dropdown
    matches.forEach(item => {
        const resultItem = document.createElement('li'); // creates list item
        resultItem.textContent = item.term;
        resultItem.onclick = () => {
            // redirects to video page with matching term (encodeURIComponent just handles special characters so it won't break)
            window.location.href = `video.html?term=${encodeURIComponent(item.term)}`;
        };
        searchResults.appendChild(resultItem);
    });

    // show dropdown if there are matches
    if (matches.length > 0) {
        searchResults.style.display = 'block';
    }
}