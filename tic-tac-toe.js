const board = document.querySelector('.board'); 
const message = document.querySelector('.message'); 
let cells = []; 
let players = []; 
let currentPlayerIndex = 0; 
let moveCount = 0; 
let gameOver = false; 

document.getElementById('startGame').addEventListener('click', () => {
    let size = parseInt(document.getElementById('boardSize').value); 
    let winCondition = parseInt(document.getElementById('winCondition').value); 

    
    if (size > 30) {
        size = 30; 
        document.getElementById('boardSize').value = 30; 
        updateMessage('Размер поля (N) не может быть больше 30. Установлено значение 30.');
    }

    if (winCondition > size) {
        winCondition = size; 
        document.getElementById('winCondition').value = size; 
        updateMessage(`Количество клеток для победы (M) не может быть больше размера поля (N). Установлено значение ${size}.`);
    }

    const playerCount = prompt("Введите количество игроков (2 до M): ");
    if (playerCount < 2 || playerCount > winCondition) {
        updateMessage(`Количество игроков должно быть от 2 до ${winCondition}.`);
        return;
    }

    players = [];
    for (let i = 0; i < playerCount; i++) {
        let symbol = prompt(`Введите символ для игрока ${i + 1}:`);
        if (i >= 2 && players.includes(symbol)) {
            updateMessage(`Символ "${symbol}" уже выбран. Пожалуйста, выберите уникальный символ.`);
            return;
        }
        players.push(symbol);
    }

    startGame(size, winCondition);
});

function startGame(size, winCondition) {
    cells = Array(size * size).fill(null); 
    moveCount = 0; 
    gameOver = false; 
    currentPlayerIndex = 0; 
    board.innerHTML = ''; 
    board.style.gridTemplateColumns = `repeat(${size}, 1fr)`; 
    updateMessage(`Ход номер ${moveCount + 1}. Сейчас ходит ${players[currentPlayerIndex]}`);
    
    cells.forEach((_, index) => {
        const cell = document.createElement('div'); 
        cell.classList.add('cell'); 
        cell.addEventListener('click', () => makeMove(index, size, winCondition)); 
        board.appendChild(cell);
    });
}

function makeMove(index, size, winCondition) {
    if (!cells[index] && !gameOver) {
        cells[index] = players[currentPlayerIndex]; 
        board.children[index].textContent = players[currentPlayerIndex]; 
        moveCount++; 

        if (checkWinner(size, winCondition)) {
            gameOver = true; 
            updateMessage(`На ходу ${moveCount} победил ${players[currentPlayerIndex]}`);
        } else if (cells.every(cell => cell)) {
            gameOver = true; 
            updateMessage(`На ходу ${moveCount} ничья`); 
        } else {
            currentPlayerIndex = (currentPlayerIndex + 1) % players.length; // Переход к следующему игроку
            updateMessage(`Ход номер ${moveCount + 1}. Сейчас ходит ${players[currentPlayerIndex]}`);
        }
    }
}

function checkWinner(size, winCondition) {
    const winPatterns = generateWinPatterns(size, winCondition); 
    return winPatterns.some(pattern => 
        pattern.every(index => cells[index] === players[currentPlayerIndex])
    );
}

function generateWinPatterns(size, winCondition) {
    const patterns = [];
    
   
    cells.map((_, i) => {
        const row = Math.floor(i / size);
        if (i % size <= size - winCondition) {
            patterns.push([...Array(winCondition)].map((_, k) => row * size + (i % size) + k));
        }
    });

    
    cells.map((_, i) => {
        const col = i % size;
        if (Math.floor(i / size) <= size - winCondition) {
            patterns.push([...Array(winCondition)].map((_, k) => (Math.floor(i / size) + k) * size + col));
        }
    });

   
    cells.map((_, i) => {
        if (i % size <= size - winCondition && Math.floor(i / size) <= size - winCondition) {
            patterns.push([...Array(winCondition)].map((_, k) => (Math.floor(i / size) + k) * size + (i % size) + k));
        }
    });

   
    cells.map((_, i) => {
        if (i % size >= winCondition - 1 && Math.floor(i / size) <= size - winCondition) {
            patterns.push([...Array(winCondition)].map((_, k) => (Math.floor(i / size) + k) * size + (i % size) - k));
        }
    });

    return patterns;
}

function updateMessage(text) {
    message.textContent = text;
}
