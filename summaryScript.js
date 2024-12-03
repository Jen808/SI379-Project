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
// Summary View Initialization
// ================================

// ====== Fetch Character Data ======
function initializeSummaryView() {
    const masterData = [];
    const detailData = [];

    fetch('detail.json')
        .then(response => response.json())
        .then(data => {
            const characters = data.results;

            // ====== Total Characters ======
            // Calculates and displays the total number of characters
            // document.getElementById('total-characters').textContent = characters.length;
            // 'total-characters'.textContent = characters.length;
            document.querySelector('#total-characters').textContent = characters.length;



            // ====== Status Breakdown ======
            // Calculates and displays the count of characters by status
            const statusCounts = {};
            characters.forEach(char => {
                statusCounts[char.status] = (statusCounts[char.status] || 0) + 1;
            });
            
            const statusBreakdown = document.querySelector('#status-breakdown');


            for (const [status, count] of Object.entries(statusCounts).sort()) {
                const li = document.createElement('li');
                li.textContent = `${status}: ${count}`;
                statusBreakdown.appendChild(li);
            }



            // ====== Species Breakdown ======
            // Calculates and displays the count of characters by species
            const speciesCounts = {};
            characters.forEach(char => {
                speciesCounts[char.species] = (speciesCounts[char.species] || 0) + 1;
            });

            const speciesBreakdown = document.querySelector('#species-breakdown');


            for (const [species, count] of Object.entries(speciesCounts).sort()) {
                const li = document.createElement('li');
                li.textContent = `${species}: ${count}`;
                speciesBreakdown.appendChild(li);
            }

            // ====== Type Breakdown ======
            // Calculates and displays the count of characters by type
            const typeCounts = {};
            characters.forEach(char => {
                if (char.type === '') {
                    char.type = 'Normal';
                }
                typeCounts[char.type] = (typeCounts[char.type] || 0) + 1;
            });

            const typeBreakdown = document.querySelector('#type-breakdown');

            for (const [type, count] of Object.entries(typeCounts).sort()) {
                const li = document.createElement('li');
                li.textContent = `${type}: ${count}`;
                typeBreakdown.appendChild(li);
            }

            // ====== Gender Breakdown ======
            // Calculates and displays the count of characters by gender
            const genderCounts = {};
            characters.forEach(char => {
                genderCounts[char.gender] = (genderCounts[char.gender] || 0) + 1;
            });

            const genderBreakdown = document.querySelector('#gender-breakdown');

            for (const [gender, count] of Object.entries(genderCounts).sort()) {
                const li = document.createElement('li');
                li.textContent = `${gender}: ${count}`;
                genderBreakdown.appendChild(li);
            }

            // ====== Origin Breakdown ======
            // Calculates and displays the count of characters by origin
            const originCounts = {};
            characters.forEach(char => {
                originCounts[char.origin.name] = (originCounts[char.origin.name] || 0) + 1;
            });

            const originBreakdown = document.querySelector('#origin-breakdown');

            for (const [origin, count] of Object.entries(originCounts).sort()) {
                const li = document.createElement('li');
                li.textContent = `${origin}: ${count}`;
                originBreakdown.appendChild(li);
            }

            // ====== Location Breakdown ======
            // Calculates and displays the count of characters by location
            const locationCounts = {};
            characters.forEach(char => {
                locationCounts[char.location.name] = (locationCounts[char.location.name] || 0) + 1;
            });

            const locationBreakdown = document.querySelector('#location-breakdown');

            for (const [location, count] of Object.entries(locationCounts).sort()) {
                const li = document.createElement('li');
                li.textContent = `${location}: ${count}`;
                locationBreakdown.appendChild(li);
            }


            // ====== Episode Statistics ======
            // Calculates and displays min, max, and average number of episodes per character
            const episodes = characters.map(char => char.episode_count);
            document.querySelector('#min-episodes').textContent = Math.min(...episodes);

            document.querySelector('#max-episodes').textContent = Math.max(...episodes);

            document.querySelector('#average-episodes').textContent = (
                episodes.reduce((sum, ep) => sum + ep, 0) / episodes.length
            ).toFixed(2);
        })
        .catch(error => console.error('Error loading JSON:', error));
}

initializeSummaryView();