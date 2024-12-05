/* ==================================================================
//
// Web site: Rick and Morty Characters
// Web page: detail.html - Javscript
// Course:   SI 379
// Homework: Group Project
// Author: Jennifer Jung, Timmy Huang
// Description:
//   Javascript which applies for the detail search filter view page
// 
//================================================================= */


// ================================
// Detail View Initialization 
// ================================

function initializeDetailView() {
    const detailFilterInput = document.querySelector('#detail-filter-input');
    const detailSearchInput = document.querySelector('#detail-search-input');
    const detailResults = document.querySelector('#detail-results');
    let characters = [];
    let detailData = [];
    let masterData = [];

    // Load filter and search inputs from local storage
    detailFilterInput.value = localStorage.getItem('detailFilterInput') || '';
    detailSearchInput.value = localStorage.getItem('detailSearchInput') || '';


    // ====== Fetch Character Data ======
    // Loads character data and initializes filtering logic
    fetch('master.json')
        .then(response => response.json())
        .then(data => {
            masterData = data.results;
            console.log("masterData");
            fetch('detail.json')
                .then(response => response.json())
                .then(data => {
                    detailData = data.results;
                    // Combine master and detail data
                    characters = detailData.map(detail => {
                        const master = masterData.find(master => master.id === detail.id);
                        return {
                            ...master,
                            ...detail,
                        };
                    });
                    filterAndDisplay();
                });

        })
        .catch(error => console.error('Error loading JSON file:', error));

    setupFilters();

    // ====== Setup Filters ======
    // Initializes event listeners for search filtering
    function setupFilters() {
        detailFilterInput.addEventListener('input', filterAndDisplay);
        detailSearchInput.addEventListener('input', filterAndDisplay);
        detailFilterInput.addEventListener('input', storeFilterInput);
        detailSearchInput.addEventListener('input', storeSearchInput);
    }


    function storeFilterInput() {
        localStorage.setItem('detailFilterInput', detailFilterInput.value);
    }

    function storeSearchInput() {
        localStorage.setItem('detailSearchInput', detailSearchInput.value);
    }

    // ====== Filter and Display ======
    // Filters the characters based on search term then displays results
    function filterAndDisplay() {
        const searchTerm = detailFilterInput.value.toLowerCase();

        let filteredCharacters = characters;

        // Filter by search term
        filteredCharacters = filteredCharacters.filter(character =>
            character.name.toLowerCase().includes(searchTerm) || 
            character.species.toLowerCase().includes(searchTerm) ||
            character.status.toLowerCase().includes(searchTerm) ||
            character.type.toLowerCase().includes(searchTerm) ||
            character.location.name.toLowerCase().includes(searchTerm) ||
            character.origin.name.toLowerCase().includes(searchTerm)
        );

        displayDetailResults(filteredCharacters);
    }

    // ====== Display Detailed Results ======
    // Renders the detailed character information
    function displayDetailResults(characters) {
        detailResults.innerHTML = '';
        characters.forEach(character => {
            const card = document.createElement('div');
            card.classList.add('character-card-detail');
            
            // Create the elements properly
            const img = document.createElement('img');
            img.src = character.image;
            img.alt = character.name;
            
            const infoDiv = document.createElement('div');
            
            const name = document.createElement('h3');
            name.innerHTML = highlightSearchTerms(character.name, detailSearchInput.value);
            infoDiv.appendChild(name);

            const details = [
                ['ID', character.id],
                ['Status', character.status],
                ['Species', character.species],
                ['Type', character.type || 'Normal'],
                ['Location', character.location.name],
                ['Origin', character.origin.name],
                ['Number of Episodes', character.episode_count]
            ];

            // Build the info section
            details.forEach(([label, value]) => {
                const p = document.createElement('p');
                const strong = document.createElement('strong');
                const text = document.createElement('span');
                strong.textContent = `${label}: `;
                p.appendChild(strong);
                text.innerHTML = highlightSearchTerms(String(value), detailSearchInput.value);
                p.appendChild(text);
                
                infoDiv.appendChild(p);
            });

            // Assemble the card
            card.appendChild(img);
            card.appendChild(infoDiv);
            detailResults.appendChild(card);
        });
    }

    // ====== Highlight Search Terms ======
    // Highlights the search term in the text
    function highlightSearchTerms(text, searchTerm) {
        if (!searchTerm) {
            return text;
        }

        return text.replace(new RegExp(searchTerm, 'gi'), match =>
            `<span class="highlight">${match}</span>`
        );
    }

}

initializeDetailView();