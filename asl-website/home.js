// array of available terms (stored separately, not displayed --> UPDATE AS WE GO)
const terms = [
    { term: 'ARM', video: 'video1.mp4' },
    { term: 'BACK', video: 'video2.mp4' },
    { term: 'CHEST', video: 'video1.mp4' },
    { term: 'EARS', video: 'video2.mp4' },
    { term: 'EYES', video: 'video1.mp4' },
    { term: 'HEAD', video: 'video2.mp4' },
    { term: 'JAW', video: 'video1.mp4' },
    { term: 'KNEES', video: 'video2.mp4' },
    { term: 'NOSE', video: 'video1.mp4' },
    { term: 'RIBS', video: 'video2.mp4' },
    { term: 'STOMACH', video: 'video1.mp4' },
    { term: 'THROAT', video: 'video2.mp4' }
];

function search_term() {
    const input = document.getElementById('searchbar').value.toLowerCase();
    const searchResults = document.getElementById('search-results');

    // clear previous results
    searchResults.innerHTML = '';
    searchResults.style.display = 'none'; // hide dropdown when you're not searching

    if (input.trim() === '') {
        return; // do nothing if input is empty
    }

    // filter terms based on what matches
    const matches = terms.filter(item => item.term.toLowerCase().includes(input));

    // display matches in the dropdown
    matches.forEach(item => {
        const resultItem = document.createElement('li');
        resultItem.textContent = item.term;
        resultItem.onclick = () => {
            // redirects to video page with matching term
            window.location.href = `video.html?term=${encodeURIComponent(item.term)}`;
        };
        searchResults.appendChild(resultItem);
    });

    // show dropdown if there are matches
    if (matches.length > 0) {
        searchResults.style.display = 'block';
    }
}


document.addEventListener('DOMContentLoaded', () => {
    // handle checkbox enabling/disabling
    const buttonItems = document.querySelectorAll('.btn-item');

    buttonItems.forEach(item => {
        const checkbox1 = item.querySelector('.checkbox-1'); // "viewed"
        const checkbox2 = item.querySelector('.checkbox-2'); // "tested"

        checkbox1.addEventListener('change', () => {
            if (checkbox1.checked) {
                checkbox2.disabled = false; // enable tested button when viewed button is checked
            } else {
                checkbox2.disabled = true; // disable tested button when viewed button is unchecked
                checkbox2.checked = false; // uncheck tested button when disabled
            }
        });
    });

    // button click handling for page navigation
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            // generate a URL based on the button title, replace spaces with hyphens
            const title = button.getAttribute('data-title');
            const pageTitle = title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '.html';
            window.location.href = pageTitle;
        });
    });
});