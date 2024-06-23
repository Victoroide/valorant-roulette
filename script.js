const agents = [
    "Brimstone", "Viper", "Omen", "Killjoy", "Cypher",
    "Sova", "Sage", "Phoenix", "Jett", "Reyna",
    "Raze", "Breach", "Skye", "Yoru", "Astra",
    "KAY/O", "Chamber", "Neon", "Fade", "Harbor", "Iso", "Clove", "Deadlock"
];

let currentPlayerIndex = 0;
let remainingAgents = [...agents];
let players = [];
let isAnimating = false;

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('startButton').addEventListener('click', startAssignment);
    document.getElementById('spinButton').addEventListener('click', assignAgent);
    updateAvailableAgentsList();
});

function startAssignment() {
    const playerInputs = document.querySelectorAll('.player-input');
    players = [];
    playerInputs.forEach(input => {
        if (input.value.trim()) {
            players.push({name: input.value.trim(), agent: null});
            input.disabled = true;
        }
        input.value = input.value.split(':')[0]; // Eliminar asignaciones previas
    });

    if (players.length === 0) {
        alert("Please enter at least one player.");
        return;
    }

    currentPlayerIndex = 0;
    remainingAgents = [...agents];
    document.getElementById('spinButton').disabled = false;
    document.getElementById('startButton').disabled = true;
    updateCurrentPlayerHighlight();
    updateAvailableAgentsList();
}

function resetAssignments() {
    const playerInputs = document.querySelectorAll('.player-input');
    playerInputs.forEach(input => {
        input.value = input.value.split(':')[0];
        input.disabled = false;
    });

    document.getElementById('spinButton').disabled = false;
    document.getElementById('startButton').textContent = 'Start';
    document.getElementById('startButton').disabled = false;
    currentPlayerIndex = 0;
    remainingAgents = [...agents];
    updateCurrentPlayerHighlight();
    updateAvailableAgentsList();
}

function updateCurrentPlayerHighlight() {
    const playerInputs = document.querySelectorAll('.player-input');
    playerInputs.forEach((input, index) => {
        input.classList.toggle('highlight', index === currentPlayerIndex);
    });
}

function assignAgent() {
    if (currentPlayerIndex >= players.length || isAnimating) {
        return;
    }

    isAnimating = true;
    showLoadingAnimation();

    const randomIndex = Math.floor(Math.random() * remainingAgents.length);
    const randomAgent = remainingAgents[randomIndex];

    players[currentPlayerIndex].agent = randomAgent;
    document.querySelectorAll('.player-input')[currentPlayerIndex].value = `${players[currentPlayerIndex].name}: ${randomAgent}`;
    
    remainingAgents = remainingAgents.filter(agent => agent !== randomAgent);
    updateAvailableAgentsList();

    currentPlayerIndex++;
    if (currentPlayerIndex < players.length) {
        updateCurrentPlayerHighlight();
    } else {
        document.getElementById('spinButton').disabled = true;
        document.getElementById('startButton').textContent = 'Restart';
        document.getElementById('startButton').disabled = false;
    }
    hideLoadingAnimation();
    isAnimating = false;
}

function showLoadingAnimation() {
    document.getElementById('loadingContainer').style.display = 'block';
}

function hideLoadingAnimation() {
    document.getElementById('loadingContainer').style.display = 'none';
}

function updateAvailableAgentsList() {
    const agentList = document.getElementById('agentList');
    agentList.innerHTML = '';
    remainingAgents.forEach(agent => {
        const listItem = document.createElement('div');
        listItem.className = 'agent-bubble';
        listItem.textContent = agent;
        agentList.appendChild(listItem);
    });
}

function editPlayer(button) {
    const input = button.parentNode.querySelector('.player-input');
    input.disabled = false;
    input.focus();
}

function deletePlayerContent(button) {
    const input = button.parentNode.querySelector('.player-input');
    input.value = '';
    input.disabled = false;
}
