/* ==================================================================
//
// Web site: Rick and Morty Characters
// Web page: index.html - Javscript
// Course:   SI 379
// Homework: Group Project
// Author: Jennifer Jung, Timmy Huang
// Description:
//   Javascript which applies for the main view page which includes master and detail data
// 
//================================================================= */

// ================================
// Main View Initialization 
// ================================

function initializeMainView() {
    const masterTable = document.querySelector('#character-summary-list');
    const detailTable = document.querySelector('#character-details');
    let masterData = [];
    let detailData = [];

    // Fetch master data
    fetch('master.json')
        .then(response => response.json())
        .then(data => {
            masterData = data.results;
            displayMasterTable(masterData);
        })
        .catch(error => console.error('Error loading JSON file:', error));

    fetch('detail.json')
        .then(response => response.json())
        .then(data => {
            detailData = data.results;
        })
        .catch(error => console.error('Error loading JSON file:', error));


    displayDefaultDetailMessage();

    // ============= Display Master Table ============
    // Renders the master table showing character IDs and names.
    function displayMasterTable(characters) {
        masterTable.innerHTML = '';
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
            card.addEventListener('click', () => displayDetailTable(character.id));
            masterTable.appendChild(card);
        });
    }

    // ========= Display Detail Table ==========
    // Shows detailed information about a selected character.
    function displayDetailTable(id) {
        console.log('Displaying details for character ID:', id);
        const characterDetail = detailData.find(character => character.id === id);
        const characterMaster = masterData.find(character => character.id === id);
        detailTable.innerHTML = `
            <img src="${characterMaster.image}" alt="${characterMaster.name}">
            <h3>${characterMaster.name}</h3>
            <p><strong>ID:</strong> ${characterDetail.id}</p>
            <p><strong>Status:</strong> ${characterDetail.status}</p>
            <p><strong>Species:</strong> ${characterDetail.species}</p>
            <p><strong>Type:</strong> ${characterDetail.type}</p>
            <p><strong>Location:</strong> ${characterDetail.location.name}</p>
            <p><strong>Origin:</strong> ${characterDetail.origin.name}</p>
            <p><strong>Number of Episodes:</strong> ${characterDetail.episode_count}</p>
        `;
    }

    // Function to display a default message
    function displayDefaultDetailMessage() {
        detailTable.innerHTML = `
                <p style="text-align: center; font-size: 1.2rem; color: #777; margin-top: 100px;">Select a character from the <br> Master Table to view details.</p>
            `;
    }
}

initializeMainView();