const agents = [
    { name: "Brimstone", img: "images/brimstone-avatar.jpg" },
    { name: "Viper", img: "images/viper-avatar.jpg" },
    { name: "Omen", img: "images/omen-avatar.jpg" },
    { name: "Killjoy", img: "images/killjoy-avatar.jpg" },
    { name: "Cypher", img: "images/cypher-avatar.jpg" },
    { name: "Sova", img: "images/sova-avatar.jpg" },
    { name: "Sage", img: "images/sage-avatar.jpg" },
    { name: "Phoenix", img: "images/phoenix-avatar.jpg" },
    { name: "Jett", img: "images/jett-avatar.jpg" },
    { name: "Reyna", img: "images/reyna-avatar.jpg" },
    { name: "Raze", img: "images/raze-avatar.jpg" },
    { name: "Breach", img: "images/breach-avatar.jpg" },
    { name: "Skye", img: "images/skye-avatar.jpg" },
    { name: "Yoru", img: "images/yoru-avatar.jpg" },
    { name: "Astra", img: "images/astra-avatar.jpeg" },
    { name: "KAY/O", img: "images/kayo-avatar.jpg" },
    { name: "Chamber", img: "images/chamber-avatar.jpg" },
    { name: "Neon", img: "images/neon-avatar.jpeg" },
    { name: "Fade", img: "images/fade-avatar.jpg" },
    { name: "Harbor", img: "images/harbor-avatar.jpg" },
    { name: "Iso", img: "images/iso-avatar.jpg" },
    { name: "Clove", img: "images/clove-avatar.jpeg" },
    { name: "Deadlock", img: "images/deadlock-image.jpg" }
];

let currentPlayerIndex = 0;
let remainingAgents = [...agents];
let players = [];
let isAnimating = false;

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('startButton').addEventListener('click', startAssignment);
    document.getElementById('shuffleButton').addEventListener('click', assignAgent);
    document.getElementById('shuffleAllButton').addEventListener('click', shuffleAll);
    updateAvailableAgentsList();
});

function startAssignment() {
    resetAssignments();
    const playerInputs = document.querySelectorAll('.player-input');
    players = [];
    playerInputs.forEach(input => {
        if (input.value.trim()) {
            players.push({ name: input.value.trim(), agent: null });
            input.disabled = true;
        }
        input.value = input.value.split(':')[0]; 
    });

    if (players.length === 0) {
        alert("Please enter at least one player.");
        return;
    }

    currentPlayerIndex = 0;
    remainingAgents = [...agents];
    document.getElementById('shuffleButton').disabled = false;
    document.getElementById('shuffleAllButton').disabled = false;
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

    document.querySelectorAll('.agent-img').forEach(img => {
        img.src = 'images/transparent.png';
        img.style.backgroundColor = 'transparent';
    });

    document.getElementById('shuffleButton').disabled = false;
    document.getElementById('shuffleAllButton').disabled = false;
    document.getElementById('startButton').textContent = 'Start';
    document.getElementById('startButton').disabled = false;
    currentPlayerIndex = 0;
    remainingAgents = [...agents];
    updateCurrentPlayerHighlight();
    updateAvailableAgentsList();
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
    document.querySelectorAll('.player-input')[currentPlayerIndex].value = players[currentPlayerIndex].name;
    const imgElement = document.getElementById(`agentImg${currentPlayerIndex + 1}`);
    imgElement.src = randomAgent.img;
    imgElement.style.backgroundColor = 'transparent';
    
    remainingAgents = remainingAgents.filter(agent => agent.name !== randomAgent.name);
    updateAvailableAgentsList();

    currentPlayerIndex++;
    if (currentPlayerIndex < players.length) {
        updateCurrentPlayerHighlight();
    } else {
        document.getElementById('shuffleButton').disabled = true;
        document.getElementById('shuffleAllButton').disabled = true;
        document.getElementById('startButton').textContent = 'Restart';
        document.getElementById('startButton').disabled = false;
    }
    hideLoadingAnimation();
    isAnimating = false;
}

function shuffleAll() {
    while (currentPlayerIndex < players.length) {
        assignAgent();
    }
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
        listItem.textContent = agent.name;
        agentList.appendChild(listItem);
    });
}

function updateCurrentPlayerHighlight() {
    const playerInputs = document.querySelectorAll('.player-input');
    playerInputs.forEach((input, index) => {
        input.classList.toggle('highlight', index === currentPlayerIndex);
    });
}

function editPlayer(button) {
    const input = button.parentNode.querySelector('.player-input');
    input.disabled = false;
    input.focus();
    button.innerHTML = '<i class="fas fa-check"></i>';
    button.style.backgroundColor = '#43a047'; 
    button.onclick = function() { confirmEdit(button); };
    input.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            confirmEdit(button);
        }
    });
}

function confirmEdit(button) {
    const input = button.parentNode.querySelector('.player-input');
    input.disabled = true;
    button.innerHTML = '<i class="fas fa-edit"></i>';
    button.style.backgroundColor = '';
    button.onclick = function() { editPlayer(button); };
}

function deletePlayerContent(button) {
    const input = button.parentNode.querySelector('.player-input');
    input.value = '';
    input.disabled = false;
    const imgId = `agentImg${Array.from(document.querySelectorAll('.delete-button')).indexOf(button) + 1}`;
    document.getElementById(imgId).src = 'images/transparent.png';
    document.getElementById(imgId).style.backgroundColor = 'transparent';
}