document.addEventListener('DOMContentLoaded', function() {
    loadSeasons();

    let seasonSelector = document.getElementById('season-select');
    seasonSelector.addEventListener('input', function() {
        updateData();
    });

    let genderSelector = document.getElementById('gender-select');
    genderSelector.addEventListener('input', function() {
        updateData();
    });

    let resetButton = document.getElementById('reset-button');
    resetButton.addEventListener('click', function() {
        resetTable();
    });

    // Jumps to event table when event is selected from the drop down menu
    let eventSelector = document.getElementById('event');
    eventSelector.addEventListener('change', function() {
        let selectedEvent = this.value;
        window.location.hash = selectedEvent;
    });

    let saveButton = document.getElementById('save-button');
    saveButton.addEventListener('click', function() {
        saveResults();
    });

    let selectSave = document.getElementById('saved-results');
    fetch('/savedResults')
    .then(response => response.json())
    .then(data => {
        for (let id in data['saved_results']) {
            let option = document.createElement('option');
            option.value = id;
            option.innerHTML = data['saved_results'][id];
            selectSave.appendChild(option);
        }
    });
    selectSave.addEventListener('change', function() {
        let id = this.value;
        fetch(`/loadSaved?id=${id}`)
        .then(response => response.json())
        .then(data => {
            updateTables(data);
            updateScores();
        });
    });

});

function moveResult(button, direction) {
    let delta;
    let sibling;
    if (direction === 'up') {
        delta = 1;
        sibling = button.parentElement.parentElement.previousElementSibling;
    } else {
        delta = -1;
        sibling = button.parentElement.parentElement.nextElementSibling;
    }
    const rowToMove = button.parentElement.parentElement;
    rowToMove.children[0].textContent = +rowToMove.children[0].textContent - delta;
    sibling.children[0].textContent = +sibling.children[0].textContent + delta;
    if (direction === 'up') {
        rowToMove.parentElement.insertBefore(rowToMove, sibling);
    } else {
        rowToMove.parentElement.insertBefore(sibling, rowToMove);
    }
    updateScores();
    resetButtons(rowToMove.parentElement);
}

function resetButtons(table) {
    for (let i = 1; i < table.children.length; i++) {
        let row = table.children[i];
        let upButton = row.children[4].children[0];
        let downButton = row.children[4].children[1];
        if (i === 1) {
            upButton.disabled = true;
        } else {
            upButton.disabled = false;
        }
        if (i === table.children.length - 1) {
            downButton.disabled = true;
        } else {
            downButton.disabled = false;
        }
    }
}

function updateTables(data) {
    let tableContainer = document.getElementById('data-container');
    tableContainer.innerHTML = '';
    const eventList = ['60 Meters', '100 Meters', '200 Meters', '400 Meters', '800 Meters', '1500 Meters', 'Mile', '3000 Meters', '5000 Meters', 
    '10,000 Meters', '60 Hurdles', '100 Hurdles', '110 Hurdles', '400 Hurdles', '3000 Steeplechase', '4 x 100 Relay', '4 x 200 Relay', '4 x 400 Relay', '4 x 800 Relay', 
    'Distance Medley Relay', 'High Jump', 'Pole Vault', 'Long Jump', 'Triple Jump', 'Shot Put', 'Weight Throw', 'Discus', 'Hammer', 'Javelin', 'Pentathlon', 'Heptathlon', 'Decathlon']

    let eventSelector = document.getElementById('event');
    eventSelector.innerHTML = '';
    for (let eventNum in eventList) {
        if (!(Object.keys(data).includes(eventList[eventNum]))) {
            continue;
        }
        let option = document.createElement('option');
        option.value = eventList[eventNum];
        option.innerHTML = eventList[eventNum];
        eventSelector.appendChild(option);
        
        eventName = eventList[eventNum];
        let eventDiv = document.createElement('div');
        eventDiv.id = eventName;
        let eventHeader = document.createElement('h3');
        
        eventHeader.textContent = eventName;
        eventDiv.appendChild(eventHeader);

        // Create checkbox
        let checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = true;
        eventHeader.appendChild(checkbox);
        checkbox.addEventListener('click', function() {
            updateScores();
        });

        let table = document.createElement('table');
        let eventRow = document.createElement('tr');
        
        // Create table headers
        let headers = ['place', 'name', 'team', 'mark'];
        for (let i = 0; i < headers.length; i++) {
            let headerCell = document.createElement('th');
            let capitalized = headers[i].charAt(0).toUpperCase() + headers[i].slice(1);
            headerCell.textContent = capitalized;
            eventRow.appendChild(headerCell);
        }
        table.appendChild(eventRow);
        
        // Create table rows
        for (let i = 0; i < data[eventName].length; i++) {
            let event = data[eventName][i];
            let eventRow = document.createElement('tr');
            
            let placeCell = document.createElement('td');
            placeCell.textContent = i + 1;
            eventRow.appendChild(placeCell);
            
            // Create table cells
            for (let j = 1; j < headers.length; j++) {
                let dataCell = document.createElement('td');
                dataCell.textContent = event[headers[j]];
                eventRow.appendChild(dataCell);
            }

            // Create buttons
            let upButton = document.createElement('button');
            upButton.textContent = 'Up';
            upButton.addEventListener('click', function() {
                moveResult(upButton, 'up');
            });
            let downButton = document.createElement('button');
            downButton.textContent = 'Down';
            downButton.addEventListener('click', function() {
                moveResult(downButton, 'down');
            });

            // Add buttons to row
            let buttonCell = document.createElement('td');
            buttonCell.appendChild(upButton);
            buttonCell.appendChild(downButton);
            eventRow.appendChild(buttonCell);

            
            table.appendChild(eventRow);
        }

        resetButtons(table);
        
        eventDiv.appendChild(table);

        tableContainer.appendChild(eventDiv);
    }
}

function resetTable() {
    for (checkbox of document.querySelectorAll('input[type="checkbox"]')) {
        if (!checkbox.checked) {
            checkbox.checked = true;

        }
    }
    updateData();
}

function updateScores() {
    let scores = {};
    let placeScores = [10, 8, 6, 5, 4, 3, 2, 1];

    tableContainer = document.getElementById('data-container');
    tables = tableContainer.children;
    for (let event = 0; event < tables.length; event++) {
        data = tableContainer.children[event].children[1].children;
        if (!tableContainer.children[event].children[0].children[0].checked) {
            continue;
        }
        // check for checkbox is checked
        // add event listener to checkbox to update scores
        for (let i = 1; i < data.length; i++) {
            let team = data[i].children[2].textContent;
            let place = +data[i].children[0].textContent;
            if (place > 8) {
                continue;
            }
            if (team in scores) {
                scores[team] += placeScores[place - 1];
            } else {
                scores[team] = placeScores[place - 1];
            }
        }
    }
    let sortedTeams = Object.keys(scores).sort(function(a, b) {
        return scores[b] - scores[a];
    });
    updateScoreDisplay(sortedTeams, scores);
}

function updateScoreDisplay(sortedTeams, scores) {
    const scoreDiv = document.getElementById('result-container');
    scoreDiv.innerHTML = '';
    for (let team in sortedTeams) { 
        let teamName = document.createElement('h3');
        teamName.textContent = sortedTeams[team];
        scoreDiv.appendChild(teamName);
        let score = document.createElement('p');
        score.textContent = scores[sortedTeams[team]];
        scoreDiv.appendChild(score);
    }
}

function updateData() {
    season = document.getElementById('season-select').value;
    gender = document.getElementById('gender-select').value;
    fetch(`/results?season=${season}&gender=${gender}`)
    .then(response => response.json())
    .then(data => {
        // create table dynamically
        updateTables(data);
        updateScores(data);
    });
}


function loadSeasons() {
    fetch('/seasons')
    .then(response => response.json())
    .then(data => {
        selector = document.getElementById('season-select');
        for (let id in data['seasons']) {
            let option = document.createElement('option');
            option.value = id;
            option.innerHTML = data['seasons'][id];
            selector.appendChild(option);
        }
        fetch('/currentSeason')
        .then(response => response.json())
        .then(data => {
            selector.value = data['current_season'];
            updateData();
        });
    });
}

function jsonifyResults() {
    let results = {};
    let tableContainer = document.getElementById('data-container');
    tables = tableContainer.children;
    for (let event = 0; event < tables.length; event++) {
        let eventName = tables[event].children[0].textContent;
        let data = tables[event].children[1].children;
        results[eventName] = [];
        for (let i = 1; i < data.length; i++) {
            let result = {};
            result['place'] = data[i].children[0].textContent;
            result['name'] = data[i].children[1].textContent;
            result['team'] = data[i].children[2].textContent;
            result['mark'] = data[i].children[3].textContent;
            results[eventName].push(result);
        }
    }
    return results;
}

function saveResults() {
    let results = jsonifyResults();
    let saveName = document.getElementById('save-name').value;

    fetch('/saveResults', {
        method: 'POST',
        body: JSON.stringify({
            saveName: saveName,
            results: results
        }),
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(confirm => {
        let select = document.getElementById('saved-results');
        let option = document.createElement('option');
        option.value = confirm['id'];
        option.innerHTML = confirm['name'];
        select.appendChild(option);
    });

    document.getElementById('save-name').value = '';
    document.getElementById('save-name').placeholder = 'Scenario name';
}