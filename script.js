const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const resetButton = document.getElementById('resetButton');
let currentPlayer = 'X';
let gameState = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
let esperandoCPU = false; // Flag para impedir x de jgoar enqt

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function handleCellClick(event) {
    if (esperandoCPU) return; // x nao joga qnd for CPU

    const clickedCell = event.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    if (gameState[clickedCellIndex] !== '' || !gameActive) {
        return;
    }

    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.textContent = currentPlayer;

    checkForWinner();

    if (gameActive) {
        currentPlayer = 'O';
        statusText.textContent = `Vez do jogador ${currentPlayer}`; 
        esperandoCPU = true; // bloq a jogada do jogador enquanto a CPU pensa
        setTimeout(jogadaCPU, 2000); // atraso de 2 seg
    }
}

function jogadaCPU() {
    if (!gameActive) return;

    let jogada = verificarJogadaVencedora('O'); 
    if (jogada === -1) jogada = verificarJogadaVencedora('X'); 
    if (jogada === -1) jogada = gameState[4] === '' ? 4 : -1; 
    if (jogada === -1) jogada = escolherMelhorJogada(); 

    if (jogada !== -1) {
        gameState[jogada] = 'O';
        cells[jogada].textContent = 'O';
    }

    checkForWinner();

    if (gameActive) {
        currentPlayer = 'X';
        statusText.textContent = `Vez do jogador ${currentPlayer}`; // att para "Vez do jogador X"
        esperandoCPU = false; // libera jgd X 
    }
}

function verificarJogadaVencedora(jogador) {
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (gameState[a] === jogador && gameState[b] === jogador && gameState[c] === '') return c;
        if (gameState[a] === jogador && gameState[c] === jogador && gameState[b] === '') return b;
        if (gameState[b] === jogador && gameState[c] === jogador && gameState[a] === '') return a;
    }
    return -1;
}

function escolherMelhorJogada() {
    const cantos = [0, 2, 6, 8].filter(i => gameState[i] === '');
    if (cantos.length > 0) return cantos[Math.floor(Math.random() * cantos.length)];

    const restantes = gameState.map((v, i) => v === '' ? i : -1).filter(i => i !== -1);
    return restantes.length > 0 ? restantes[Math.floor(Math.random() * restantes.length)] : -1;
}

function checkForWinner() {
    let roundWon = false;
    let winningCombo = [];

    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (gameState[a] === '' || gameState[b] === '' || gameState[c] === '') continue;

        if (gameState[a] === gameState[b] && gameState[b] === gameState[c]) {
            roundWon = true;
            winningCombo = [a, b, c];
            break;
        }
    }

    if (roundWon) {
        statusText.textContent = `Jogador ${currentPlayer} venceu!`;
        gameActive = false;
        esperandoCPU = false;
        highlightWinningCells(winningCombo);
        return;
    }

    if (!gameState.includes('')) {
        statusText.textContent = 'Empate!';
        gameActive = false;
        esperandoCPU = false;
    }
}

function highlightWinningCells(winningCombo) {
    winningCombo.forEach(index => {
        cells[index].classList.add('winning-cell');
    });
}

function resetGame() {
    gameState = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    currentPlayer = 'X';
    esperandoCPU = false;
    statusText.textContent = `Vez do jogador ${currentPlayer}`;
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('winning-cell');
    });
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetButton.addEventListener('click', resetGame);

statusText.textContent = `Vez do jogador ${currentPlayer}`;
