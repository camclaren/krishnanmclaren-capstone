// array of available terms (stored separately, not displayed --> UPDATE AS WE GO)

const terms = [
    { term: 'ARM', video: './ASL_Videos/arm_rutgers.mp4' },
    { term: 'BACK', video: './ASL_Videos/back_rutgers.mp4' },
    { term: 'CHEST', video: './ASL_Videos/chest_rutgers.mp4' },
    { term: 'EARS', video: './ASL_Videos/ear.mp4' },
    { term: 'EYES', video: './ASL_Videos/eyes_rutgers.mp4' },
    { term: 'HEAD', video: './ASL_Videos/head_rutgers.mp4' },
    { term: 'JAW', video: './ASL_Videos/jaw_rutgers.mp4' },
    { term: 'KNEES', video: './ASL_Videos/knees_rutgers.mp4' },
    { term: 'NOSE', video: './ASL_Videos/nose_rutgers.mp4' },
    { term: 'RIBS', video: './ASL_Videos/ribs_rutgers.mp4' },
    { term: 'STOMACH', video: './ASL_Videos/stomach_rutgers.mp4' },
    { term: 'THROAT', video: './ASL_Videos/throat_rutgers.mp4' },
    { term: 'SCRAPE', video: './ASL_Videos/scrape_rutgers.mp4' },
    { term: 'STAB', video: './ASL_Videos/stab_rutgers.mp4' },
    { term: 'STITCH', video: './ASL_Videos/stitch_rutgers.mp4' },
    { term: 'CUT', video: './ASL_Videos/cut_rutgers.mp4' },
    { term: 'BURN', video: './ASL_Videos/burn_rutgers.mp4' },
    { term: 'DIZZY', video: './ASL_Videos/dizzy_rutgers.mp4' },
    { term: 'FAINT', video: './ASL_Videos/faint_rutgers.mp4' },
    { term: 'HEADACHE', video: './ASL_Videos/headache_rutgers.mp4' },
    { term: 'ITCH', video: './ASL_Videos/itch_rutgers.mp4' },
    { term: 'STOMACH CRAMPS', video: './ASL_Videos/stomachcramps_rutgers.mp4' },
    { term: 'PANIC', video: './ASL_Videos/panic_rutgers.mp4' },
    { term: 'RASH', video: './ASL_Videos/rash_rutgers.mp4' },
    { term: 'SWEATING', video: './ASL_Videos/sweating_rutgers.mp4' },
    { term: 'SWELLING', video: './ASL_Videos/swelling_rutgers.mp4' },
    { term: 'VOMIT', video: './ASL_Videos/vomit_rutgers.mp4' },
    { term: 'ALCOHOL', video: './ASL_Videos/alcohol_rutgers.mp4' },
    { term: 'COCAINE', video: './ASL_Videos/cocaine_rutgers.mp4' },
    { term: 'DRUG', video: './ASL_Videos/drug_rutgers.mp4' },
    { term: 'MARIJUANA', video: './ASL_Videos/marijuana_rutgers.mp4' },
    { term: 'OVERDOSE', video: './ASL_Videos/overdose_rutgers.mp4' }

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