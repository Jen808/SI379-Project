/* ==================================================================
//
// Web site: Rick and Morty Characters
// Web page: index.html - Javscript
// Course:   SI 379
// Homework: Group Project
// Author: Jennifer Jung, Timmy Huang
// Description:
//   Javascript which applies for all four pages.
// 
//================================================================= */


// ================================
// Detail View Initialization 
// ================================

// ====== Variables and Data Fetch ======
// Fetches character data and sets up filters for the detail views


function initializeDetailView() {
    const detailSearchInput = document.querySelector('#detail-search-input');
    const nameFilter = document.querySelector('#name-filter');
    const episodeFilter = document.querySelector('#episode-filter');
    const statusFilter = document.querySelector('#status-filter');
    const detailResults = document.querySelector('#detail-results');
    let characters = [];
    let detailData = [];
    let masterData = [];


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
    // Initializes event listeners for search, name range, episode range, and status filtering
    function setupFilters() {
        detailSearchInput.addEventListener('input', filterAndDisplay);
        nameFilter.addEventListener('change', filterAndDisplay);
        episodeFilter.addEventListener('change', filterAndDisplay);
        statusFilter.addEventListener('change', filterAndDisplay);
        filterAndDisplay(); // Initial display
    }


    // ====== Filter and Display ======
    // Filters the characters based on search term, name range, episode range, and status, then displays results
    function filterAndDisplay() {
        const searchTerm = detailSearchInput.value.toLowerCase();
        const nameRange = nameFilter.value;
        const episodeRange = episodeFilter.value;
        const status = statusFilter.value;

        let filteredCharacters = characters;


        // Filter by name range
        if (nameRange !== 'all') {
            filteredCharacters = filteredCharacters.filter(character => {
                const firstChar = character.name.charAt(0).toUpperCase();
                return nameRange === 'A-I'
                    ? firstChar >= 'A' && firstChar <= 'I'
                    : firstChar >= 'J' && firstChar <= 'Z';
            });
        }

        // Filter by episodes range
        if (episodeRange !== 'all') {
            filteredCharacters = filteredCharacters.filter(character => {
                const episodeCount = character.episode.length;
                switch (episodeRange) {
                    case '>50':
                        return episodeCount > 50;
                    case '40-50':
                        return episodeCount >= 40 && episodeCount <= 50;
                    case '30-40':
                        return episodeCount >= 30 && episodeCount <= 40;
                    case '20-30':
                        return episodeCount >= 20 && episodeCount <= 30;
                    case '10-20':
                        return episodeCount >= 10 && episodeCount <= 20;
                    case '&lt;10':
                        return episodeCount < 10;
                }
            });
        }

        // Filter by status
        if (status !== 'all') {
            filteredCharacters = filteredCharacters.filter(character =>
                character.status.toLowerCase() === status
            );
        }


        // Filter by search term
        filteredCharacters = filteredCharacters.filter(character =>
            character.name.toLowerCase().includes(searchTerm)
        );

        displayDetailResults(filteredCharacters);
    }

    // ====== Display Detailed Results ======
    // Displays the filtered characters in rows with detailed informati
    function displayDetailResults(characters) {
        detailResults.innerHTML = '';
        characters.forEach(character => {
            const card = document.createElement('div');
            card.classList.add('character-card-detail');
            card.innerHTML = `
                <img src="${character.image}" alt="${character.name}">
                <div>
                    <h3>${character.name}</h3>
                    <p><strong>ID:</strong> ${character.id}</p>
                    <p><strong>Status:</strong> ${character.status}</p>
                    <p><strong>Species:</strong> ${character.species}</p>
                    <p><strong>Type:</strong> ${character.type || 'Normal'}</p>
                    <p><strong>Location:</strong> ${character.location.name}</p>
                    <p><strong>Origin:</strong> ${character.origin.name}</p>
                    <p><strong>Number of Episodes:</strong> ${character.episode_count}</p>

                </div>
            `;
            detailResults.appendChild(card);
        });
    }
}

initializeDetailView();