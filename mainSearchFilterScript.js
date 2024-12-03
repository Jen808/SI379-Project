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
// Main View Initialization 
// ================================

function initializeMainSearchFilterView() {
    const detailFilterInput = document.querySelector('#detail-filter-input');
    const detailSearchInput = document.querySelector('#detail-search-input');
    const masterTable = document.querySelector('#character-summary-list');
    const detailTable = document.querySelector('#character-details');
    let masterData = [];
    let detailData = [];
    let characters = [];
    let selectedCharacterId = null;

    // Fetch master data
    fetch('master.json')
        .then(response => response.json())
        .then(data => {
            masterData = data.results;
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
                    filterAndDisplay(masterData); 
                })
                .catch(error => console.error('Error loading JSON file:', error));
        })
        .catch(error => console.error('Error loading JSON file:', error));

    setupFilters();

    // ====== Setup Filters ======
    // Initializes event listeners for search filtering
    function setupFilters() {
        detailFilterInput.addEventListener('input', filterAndDisplay);
        detailSearchInput.addEventListener('input', filterAndDisplay);
    }

    // ====== Filter and Display ======
    // Filters the master table based on the search and filter inputs
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

        displayMasterTable(filteredCharacters);
        displayDetailTable(selectedCharacterId);
    }

    // ============= Display Master Table ============
    // Renders the master table showing character IDs and names.
    function displayMasterTable(characters) {
        masterTable.innerHTML = '';
        characters.forEach(character => {
            // Create main card container
            const card = document.createElement('div');
            card.classList.add('character-card-index');
            
            // Create and set up image
            const img = document.createElement('img');
            img.src = character.image;
            img.alt = character.name;
            
            // Create info container
            const infoDiv = document.createElement('div');
            
            // Create and set up name
            const name = document.createElement('h3');
            name.innerHTML = highlightSearchTerms(character.name, detailSearchInput.value);
            
            // Create and set up ID
            const id = document.createElement('h1');
            id.innerHTML = `ID:${highlightSearchTerms(String(character.id), detailSearchInput.value)}`;
            
            // Assemble the elements
            infoDiv.appendChild(name);
            infoDiv.appendChild(id);
            
            card.appendChild(img);
            card.appendChild(infoDiv);
            
            // Add click event listener
            card.addEventListener('click', () => {
                selectedCharacterId = character.id;
                displayDetailTable(character.id);
            });
            
            // Add to master table
            masterTable.appendChild(card);
        });
    }

    // ========= Display Detail Table ==========
    // Shows detailed information about a selected character.
    function displayDetailTable(id) {
        console.log('Displaying details for character ID:', id);
        if (selectedCharacterId === null) {
            displayDefaultDetailMessage();
            return;
        }
        const characterDetail = detailData.find(character => character.id === id);
        const characterMaster = masterData.find(character => character.id === id);
        detailTable.innerHTML = `
            <img src="${characterMaster.image}" alt="${characterMaster.name}">
            <h3>${highlightSearchTerms(characterMaster.name, detailSearchInput.value)}</h3>
            <p><strong>ID:</strong> ${highlightSearchTerms(String(characterDetail.id), detailSearchInput.value)}</p>
            <p><strong>Status:</strong> ${highlightSearchTerms(characterDetail.status, detailSearchInput.value)}</p>
            <p><strong>Species:</strong> ${highlightSearchTerms(characterDetail.species, detailSearchInput.value)}</p>
            <p><strong>Type:</strong> ${highlightSearchTerms(characterDetail.type || 'Normal', detailSearchInput.value)}</p>
            <p><strong>Location:</strong> ${highlightSearchTerms(characterDetail.location.name, detailSearchInput.value)}</p>
            <p><strong>Origin:</strong> ${highlightSearchTerms(characterDetail.origin.name, detailSearchInput.value)}</p>
            <p><strong>Number of Episodes:</strong> ${characterDetail.episode_count}</p>
        `;
    }

    // Function to display a default message
    function displayDefaultDetailMessage() {
        detailTable.innerHTML = `
                <p style="text-align: center; font-size: 1.2rem; color: #777; margin-top: 100px;">Select a character from the <br> Master Table to view details.</p>
            `;
    }

    // ====== Highlight Search Terms ======
    function highlightSearchTerms(text, searchTerm) {
        if (!searchTerm) {
            return text;
        }

        return text.replace(new RegExp(searchTerm, 'gi'), match =>
            `<span class="highlight">${match}</span>`
        );
    }
}

initializeMainSearchFilterView();