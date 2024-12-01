document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;
    if (path.includes('index.html')) {
        initializeMainView();
    } else if (path.includes('search.html')) {
        initializeSearchView();
    } else if (path.includes('detail.html')) {
        initializeDetailView();
    } else if (path.includes('summary.html')) {
        initializeSummaryView();
    }
});

// ================================
// Main View Initialization 
// ================================

function initializeMainView() {
    const characterList = document.getElementById('character-summary-list');
    // const summaryText = document.getElementById('summary-text');
    const masterTable = document.getElementById('character-summary-list');
    const detailTable = document.getElementById('character-details');
    let characters = [];

    // Fetch character data
    fetch('dataset.json')
        .then(response => response.json())
        .then(data => {
            characters = data.results;
            displayMasterTable(characters);
            displayCharacterList(characters);
            displayDefaultDetailMessage(); // Display default message initially

            // updateSummary(characters.length);
        })
        .catch(error => console.error('Error loading JSON file:', error));

    // ============= Display Master Table ============
    // Renders the master table showing character IDs and names.
    function displayMasterTable(characters) {
        masterTable.innerHTML = '';
        characters.forEach(character => {
            const listItem = document.createElement('li');
            listItem.textContent = `ID: ${character.id}, Name: ${character.name}`;
            listItem.addEventListener('click', () => displayDetailTable(character));
            masterTable.appendChild(listItem);
        });
    }

    // ========= Display Detail Table ==========
    // Shows detailed information about a selected character.
    function displayDetailTable(character) {
        detailTable.innerHTML = `
            <img src="${character.image}" alt="${character.name}">
            <h3>${character.name}</h3>
            <p><strong>ID:</strong> ${character.id}</p>
            <p><strong>Status:</strong> ${character.status}</p>
            <p><strong>Species:</strong> ${character.species}</p>
            <p><strong>Number of Episodes:</strong> ${character.episode.length}</p>
        `;
    }

    // Function to display a default message
    function displayDefaultDetailMessage() {
        detailTable.innerHTML = `
                <p style="text-align: center; font-size: 1.2rem; color: #777; margin-top: 100px;">Select a character from the <br> Master Table to view details.</p>
            `;
    }

    // ========== Display Character List ==========
    // Renders character cards in a grid layout.

    function displayCharacterList(characters) {
        characterList.innerHTML = '';
        characters.forEach(character => {
            const card = document.createElement('div');
            card.classList.add('character-card-index');
            card.innerHTML = `
                <img src="${character.image}" alt="${character.name}">
                <div>
                    <h3>${character.name}</h3>
                    <h1>ID:${character.id}</h1>
                </div>
            `;
            card.addEventListener('click', () => displayDetailTable(character));
            characterList.appendChild(card);
        });
    }


    // ======== Update Summary ============
    // Updates the character count displayed in the summary text.

    // function updateSummary(count) {
    //     summaryText.textContent = `Displaying ${count} characters.`;
    // }
}


// ================================
// Search View Initialization 
// ================================


// ====== Variables and Data Fetch ======
// Fetches character data and sets up filters and search input



function initializeSearchView() {
    const searchInput = document.getElementById('search-input');
    const nameFilter = document.getElementById('name-filter');
    const searchResultsBody = document.getElementById('search-results-body');
    let characters = [];

    // ====== Fetch Character Data ======
    // Loads character data from the dataset and initializes filtering logic
    fetch('dataset.json')
        .then(response => response.json())
        .then(data => {
            characters = data.results;
            setupFilters();
        })
        .catch(error => console.error('Error loading JSON file:', error));

    // ====== Setup Filters ======
    // Initializes event listeners for search and name range filtering
    function setupFilters() {
        searchInput.addEventListener('input', filterAndDisplay);
        nameFilter.addEventListener('change', filterAndDisplay);
        filterAndDisplay(); // Initial display
    }

    // ====== Filter and Display ======
    // Filters the characters based on search term and name range, then displays results
    function filterAndDisplay() {
        const searchTerm = searchInput.value.toLowerCase();
        const nameRange = nameFilter.value;

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

        // Filter by search term
        filteredCharacters = filteredCharacters.filter(character =>
            character.name.toLowerCase().includes(searchTerm)
        );

        displaySearchResults(filteredCharacters);
    }

    // ====== Display Search Results ======
    // Displays the filtered characters in a table
    function displaySearchResults(characters) {
        searchResultsBody.innerHTML = '';
        characters.forEach(character => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${character.id}</td>
                <td>${character.name}</td>
                <td>${character.episode.length}</td>
            `;
            searchResultsBody.appendChild(row);
        });
    }
}




// ================================
// Detail View Initialization 
// ================================

// ====== Variables and Data Fetch ======
// Fetches character data and sets up filters for the detail views


function initializeDetailView() {
    const detailSearchInput = document.getElementById('detail-search-input');
    const nameFilter = document.getElementById('name-filter');
    const episodeFilter = document.getElementById('episode-filter');
    const statusFilter = document.getElementById('status-filter');
    const detailResults = document.getElementById('detail-results');
    let characters = [];


    // ====== Fetch Character Data ======
    // Loads character data and initializes filtering logic
    fetch('dataset.json')
        .then(response => response.json())
        .then(data => {
            characters = data.results;
            setupFilters();
        })
        .catch(error => console.error('Error loading JSON file:', error));

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
                    <p><strong>Status:</strong> ${character.status}</p>
                    <p><strong>Species:</strong> ${character.species}</p>
                    <p><strong>Number of Episodes:</strong> ${character.episode.length}</p>
                </div>
            `;
            detailResults.appendChild(card);
        });
    }
}



// ================================
// Summary View Initialization
// ================================

// ====== Fetch Character Data ======
function initializeSummaryView() {
    fetch('dataset.json')
        .then(response => response.json())
        .then(data => {
            const characters = data.results;


            // ====== Total Characters ======
            // Calculates and displays the total number of characters
            document.getElementById('total-characters').textContent = characters.length;


            // ====== Status Breakdown ======
            // Calculates and displays the count of characters by status
            const statusCounts = { alive: 0, dead: 0, unknown: 0 };
            characters.forEach(char => {
                const status = char.status.toLowerCase();
                if (statusCounts[status] !== undefined) statusCounts[status]++;
            });

            document.getElementById('alive-characters').textContent = statusCounts.alive;
            document.getElementById('dead-characters').textContent = statusCounts.dead;
            document.getElementById('unknown-characters').textContent = statusCounts.unknown;


            // ====== Species Breakdown ======
            // Calculates and displays the count of characters by species
            const speciesCounts = {};
            characters.forEach(char => {
                speciesCounts[char.species] = (speciesCounts[char.species] || 0) + 1;
            });

            const speciesBreakdown = document.getElementById('species-breakdown');
            for (const [species, count] of Object.entries(speciesCounts)) {
                const li = document.createElement('li');
                li.textContent = `${species}: ${count}`;
                speciesBreakdown.appendChild(li);
            }


            // ====== Episode Statistics ======
            // Calculates and displays min, max, and average number of episodes per character
            const episodes = characters.map(char => char.episode.length);
            document.getElementById('min-episodes').textContent = Math.min(...episodes);
            document.getElementById('max-episodes').textContent = Math.max(...episodes);
            document.getElementById('average-episodes').textContent = (
                episodes.reduce((sum, ep) => sum + ep, 0) / episodes.length
            ).toFixed(2);
        })
        .catch(error => console.error('Error loading JSON:', error));
}
