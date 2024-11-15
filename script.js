// <!--==================================================================

// Web site: Rick and Morty Characters
// Web page: Home
// Course:   SI 379
// Homework: Group Project
// Author: Jennifer Jung, Timmy Huang
// Description:
//   ????????????

// =================================================================-->


document.addEventListener('DOMContentLoaded', () => {
    const characterList = document.getElementById('character-list');
    const summaryText = document.getElementById('summary-text');
    const characterDetails = document.getElementById('character-details');
    const searchInput = document.getElementById('search-input');
    const masterTable = document.getElementById('character-summary-list');
    const detailTable = document.getElementById('character-details');
    let characters = [];

    // Fetch character data from the API
    fetch('https://rickandmortyapi.com/api/character/')
        .then(response => response.json())
        .then(data => {
            characters = data.results;
            displayMasterTable(characters); 
            displayCharacterList(characters); 
            updateSummary(characters.length); 
        })
        .catch(error => console.error('Error fetching data:', error));

    // Function to display the master table with ID and Name
    function displayMasterTable(characters) {
        masterTable.innerHTML = ''; 

        characters.forEach(character => {
            const listItem = document.createElement('li');
            listItem.textContent = `ID: ${character.id}, Name: ${character.name}`;

            listItem.addEventListener('click', () => displayDetailTable(character));

            masterTable.appendChild(listItem);
        });
    }

    // Function to display the detail table with additional character information
    function displayDetailTable(character) {
        detailTable.innerHTML = `
            <img src="${character.image}" alt="${character.name}" class="character-detail-image">
            <h3>${character.name}</h3>
            <p><strong>ID:</strong> ${character.id}</p>
            <p><strong>Status:</strong> ${character.status}</p>
            <p><strong>Species:</strong> ${character.species}</p>
            <p><strong>Gender:</strong> ${character.gender}</p>
            <p><strong>Origin:</strong> ${character.origin.name}</p>
            <p><strong>Location:</strong> ${character.location.name}</p>
            <p><strong>Number of Episodes:</strong> ${character.episode.length}</p>
            <p><strong>Episodes:</strong> ${character.episode.join(', ')}</p>
        `;
    }
    

    // Function to display main character list
    function displayCharacterList(characters) {
        characterList.innerHTML = '';

        characters.forEach(character => {
            const card = document.createElement('div');
            card.classList.add('character-card');

            card.innerHTML = `
              <img src="${character.image}" alt="${character.name}" width="100%">
              <h3>${character.name}</h3>
            `;

            card.addEventListener('click', () => showCharacterDetails(character));

            characterList.appendChild(card);
        });
    }

    // Function to update the summary text
    function updateSummary(count) {
        summaryText.textContent = `Displaying ${count} characters.`;
    }

    // Function to display character details in a separate area
    function showCharacterDetails(character) {
        characterDetails.innerHTML = `
            <h2>${character.name}</h2>
            <img src="${character.image}" alt="${character.name}">
            <p><strong>Status:</strong> ${character.status}</p>
            <p><strong>Species:</strong> ${character.species}</p>
            <p><strong>Gender:</strong> ${character.gender}</p>
            <p><strong>Origin:</strong> ${character.origin.name}</p>
            <p><strong>Location:</strong> ${character.location.name}</p>
            <p><strong>Number of Episodes:</strong> ${character.episode.length}</p>
        `;
        window.scrollTo(0, document.body.scrollHeight);
    }

    // Search functionality
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredCharacters = characters.filter(character =>
            character.name.toLowerCase().includes(searchTerm)
        );
        displayCharacterList(filteredCharacters);
        updateSummary(filteredCharacters.length);
        saveSearchTerm(searchTerm);
    });

    // Save search term to local storage
    function saveSearchTerm(term) {
        localStorage.setItem('searchTerm', term);
    }

    // Load search term from local storage
    function loadSearchTerm() {
        const term = localStorage.getItem('searchTerm');
        if (term) {
            searchInput.value = term;
            const filteredCharacters = characters.filter(character =>
                character.name.toLowerCase().includes(term)
            );
            displayCharacterList(filteredCharacters);
            updateSummary(filteredCharacters.length);
        }
    }

    // Load saved search term on page load
    loadSearchTerm();
});
