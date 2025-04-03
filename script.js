let participants = [];

function addParticipant() {
    const name = document.getElementById('name').value;
    if (name) {
        participants.push(name);
        updateParticipantsList();
        document.getElementById('name').value = '';
    } else {
        alert("Por favor, ingresa un nombre.");
    }
}

function updateParticipantsList() {
    const list = document.getElementById('participantsList');
    list.innerHTML = '';
    participants.forEach(participant => {
        const li = document.createElement('li');
        li.textContent = participant;
        list.appendChild(li);
    });
}

function pickWinner() {
    if (participants.length === 0) {
        alert("No hay participantes para el sorteo.");
        return;
    }

    const digitalBoard = document.getElementById('digitalBoard');
    let currentIndex = 0;
    const speed = 100; // Velocidad de cambio de nombre en milisegundos
    const duration = 5000; // Duración total del efecto en milisegundos

    digitalBoard.classList.remove('winner');

    const interval = setInterval(() => {
        digitalBoard.textContent = participants[currentIndex];
        currentIndex = (currentIndex + 1) % participants.length;
    }, speed);

    setTimeout(() => {
        clearInterval(interval);
        const winnerIndex = Math.floor(Math.random() * participants.length);
        digitalBoard.textContent = `¡El ganador es: ${participants[winnerIndex]}!`;
        digitalBoard.classList.add('winner');
    }, duration);
}
