
const board = document.getElementById('board');
const squares = Array.from(document.getElementsByClassName('square'));
const message = document.getElementById('message');
const restart = document.getElementById('restart');

let currentPlayer = 'X';
let gameState = Array(9).fill('');

const winning_combinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function handleClick(event) {
    const index = event.target.dataset.index;

    if (gameState[index] !== '') {
        return;
    }

    gameState[index] = currentPlayer;
    event.target.textContent = currentPlayer;

    if (checkWin(currentPlayer)) {
        message.textContent = `${currentPlayer} wins!`;
        return;
    }

    if (checkTie()) {
        message.textContent = 'It\'s a tie!';
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    message.textContent = `${currentPlayer}'s turn`;
}

function checkWin(player) {
    return winning_combinations.some(combination => {
        return combination.every(index => {
            return gameState[index] === player;
        });
    });
}

function checkTie() {
    return !gameState.includes('');
}

function restartGame() {
    gameState = Array(9).fill('');
    squares.forEach(square => {
        square.textContent = '';
    });
    message.textContent = `${currentPlayer}'s turn`;
}

squares.forEach(square => {
    square.addEventListener('click', handleClick);
});

restart.addEventListener('click', restartGame);

restartGame();

// Score Tracker
let xWins = 0;
let oWins = 0;

function checkWin(player) {
    const result = winning_combinations.some(combination => {
        return combination.every(index => {
            return gameState[index] === player;
        });
    });

    if (result) {
        if (player === 'X') {
            xWins++;
        } else {
            oWins++;
        }
        message.textContent = `${player} wins!`;
    }

    return result;
}

function updateScore() {
    message.textContent = `${currentPlayer}'s turn - X wins: ${xWins} - O wins: ${oWins}`;
}

updateScore();


//Games played and history tracker
const gameHistory = [];

function addToHistory() {
    gameHistory.push(gameState.slice());
}

function undoLastMove() {
    if (gameHistory.length === 0) {
        return;
    }

    gameState = gameHistory.pop();
    squares.forEach((square, index) => {
        if (gameState[index] !== '') {
            square.textContent = gameState[index];
        } else {
            square.textContent = '';
        }
    });

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    message.textContent = `${currentPlayer}'s turn`;
}

// Add undo button
const undoButton = document.createElement('button');
undoButton.textContent = 'Undo';
undoButton.addEventListener('click', undoLastMove);
document.body.appendChild(undoButton);

// Add move history to message area
function updateMessage() {
    message.textContent = `${currentPlayer}'s turn - X wins: ${xWins} - O wins: ${oWins}`;
    if (gameHistory.length > 0) {
        message.textContent += ` - Last move: ${gameHistory[gameHistory.length - 1].join(', ')}`;
    }
}

// Update message after each move
squares.forEach(square => {
    square.addEventListener('click', () => {
        handleClick(square);
        addToHistory();
        updateScore();
        updateMessage();
    });
});

