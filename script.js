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
    document.getElementById('resetButton').addEventListener('click', resetAssignments);
    document.getElementById('spinButton').addEventListener('click', assignAgent);
    updateAvailableAgentsList();
});

function createAgentsLine(agents) {
    // No necesitamos la creación de la línea de agentes aquí
}

function startAssignment() {
    const playerInputs = document.querySelectorAll('.player-input');
    players = [];
    playerInputs.forEach(input => {
        if (input.value.trim()) {
            players.push(input.value.trim());
            input.disabled = true;  // Bloquear campos de texto
        }
    });

    if (players.length === 0) {
        alert("Please enter at least one player.");
        return;
    }

    currentPlayerIndex = 0;
    remainingAgents = [...agents];
    document.getElementById('spinButton').disabled = false;
    document.getElementById('resetButton').style.display = 'none';
    updateCurrentPlayerHighlight();
}

function resetAssignments() {
    const playerInputs = document.querySelectorAll('.player-input');
    playerInputs.forEach(input => {
        input.value = input.value.split(':')[0]; // Mantener solo el nombre del jugador
        input.disabled = false; // Permitir edición
    });

    document.getElementById('assignedAgentsList').innerHTML = '<h2>Assigned Agents:</h2>';
    document.getElementById('spinButton').disabled = false;
    document.getElementById('resetButton').style.display = 'none';
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

    setTimeout(() => {
        document.querySelectorAll('.player-input')[currentPlayerIndex].value += `: ${randomAgent}`;
        currentPlayerIndex++;
        if (currentPlayerIndex < players.length) {
            updateCurrentPlayerHighlight();
        } else {
            document.getElementById('spinButton').disabled = true;
            document.getElementById('resetButton').style.display = 'block';
        }
        remainingAgents = remainingAgents.filter(agent => agent !== randomAgent);
        if (remainingAgents.length === 0) {
            remainingAgents = [...agents]; // Reiniciar agentes si se terminan
        }
        updateAvailableAgentsList();
        hideLoadingAnimation();
        isAnimating = false;
    }, 1500); // Reducimos el tiempo de espera a 1.5 segundos
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

function deletePlayer(button) {
    const playerContainer = button.parentNode;
    playerContainer.remove();
}