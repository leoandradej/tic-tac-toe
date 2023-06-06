const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];
  
const form = document.querySelector(".form");
const restartBtn = document.querySelector('#restartBtn');
const resetBtn = document.querySelector('#resetBtn');
  
restartBtn.addEventListener("click", () => {
    location.reload();
});
  
form.addEventListener("change", () => {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    initializeGame(data);
});
  
const initializeVariables = (data) => {
    data.choice = +data.choice;
    data.board = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    data.player1 = "x";
    data.player2 = "o";
    data.round = 0;
    data.currentPlayer = "x";
    data.gameOver = false;
};
  
const resetDom = () => {
    document.querySelectorAll(".cell").forEach((cell) => {
      cell.className = "cell";
    });
};

const setBoardHoverClass = (data) => {
    const board = document.querySelector(".board");
    board.className = "board";
    if (data.currentPlayer === data.player1) {
        board.classList.add(data.player1);
    } else if (data.currentPlayer === data.player2) {
        board.classList.add(data.player2);
    }
};
  
const addEventListenersToGameBoard = (data) => {
    document.querySelectorAll(".cell").forEach((cell) => {
        cell.addEventListener("click", (e) => {
        playMove(e.target, data);
        });
        
    });
    resetBtn.addEventListener("click", () => {
        initializeVariables(data);
        resetDom();
        setBoardHoverClass(data);
    });
};
  
const initializeGame = (data) => {
    initializeVariables(data);
    addEventListenersToGameBoard(data);
    setBoardHoverClass(data);
};
  
const playMove = (cell, data) => {
    if (data.gameOver || data.round > 8) {
        return;
    }

    if (data.board[cell.id] === data.player1 || data.board[cell.id] === data.player2) {
        return;
    }

    data.board[cell.id] = data.currentPlayer;
    cell.classList.add(data.currentPlayer === "x" ? "x" : "o");

    data.round++;

    if (endConditions(data)) {
        return;
    }

    if (data.choice === 1) {
        changePlayer(data);
        setBoardHoverClass(data);
    } else if (data.choice === 2) {
        easyAiMove(data);
        data.currentPlayer = "x";
  
    } else if (data.choice === 3) {
        changePlayer(data);
        hardAiMove(data);
    if (endConditions(data)) {
        return;
    }
      changePlayer(data);
    }
};
  
const endConditions = (data) => {
    const winningMessageElement = document.querySelector("#winningMessage");
    const winningMessageTextElement = document.querySelector("#winningMessageText");
    if (checkWinner(data, data.currentPlayer)) {
        let winnerName = data.currentPlayer === "x" ? "X" : "O";
        winningMessageTextElement.innerText = `${winnerName} Wins!`;
        winningMessageElement.classList.add("show");
        return true;
    } else if (data.round === 9) {
        winningMessageTextElement.innerText = "Draw!"
        data.gameOver = true;
        winningMessageElement.classList.add("show");
        return true;
    }
    return false;
};
  
const checkWinner = (data, player) => {
    let result = false;
    winningConditions.forEach((condition) => {
        if (data.board[condition[0]] === player &&
            data.board[condition[1]] === player &&
            data.board[condition[2]] === player) {
            result = true;
        }
    });
    return result;
};
  
  
const changePlayer = (data) => {
    data.currentPlayer = data.currentPlayer === "x" ? "o" : "x";
};
  
const easyAiMove = (data) => {
    changePlayer(data);
  
    data.round++;
    let availableSpaces = data.board.filter((space) => space !== "x" && space !== "o");
    let move = availableSpaces[Math.floor(Math.random() * availableSpaces.length)];
    data.board[move] = data.player2;
    setTimeout(() => {
        let box = document.getElementById(`${move}`);
        box.classList.add("o");
    }, 200);
  
    if (endConditions(data)) {
        return;
    }
    changePlayer(data);
};
  
const hardAiMove = (data) => {
    data.round++;
    const move = minimax(data, "o").index;
    data.board[move] = data.player2;
    let box = document.getElementById(`${move}`);
    box.classList.add("o");
  
    console.log(data);
  };
  
const minimax = (data, player) => {
    let availableSpaces = data.board.filter((space) => space !== "x" && space !== "o"
    );
    if (checkWinner(data, data.player1)) {
        return { score: -100, };
    } else if (checkWinner(data, data.player2)) {
        return { score: 100, };
    } else if (availableSpaces.length === 0) {
        return { score: 0, };
    }

    const potentialMoves = [];
    for (let i = 0; i < availableSpaces.length; i++) {
        let move = {};
        move.index = data.board[availableSpaces[i]];
        data.board[availableSpaces[i]] = player;
        if (player === data.player2) {
            move.score = minimax(data, data.player1).score;
        } else {
            move.score = minimax(data, data.player2).score;
        }

        data.board[availableSpaces[i]] = move.index;

        potentialMoves.push(move);
    }

    let bestMove = 0;
    if (player === data.player2) {
      let bestScore = -10000;
      for (let i = 0; i < potentialMoves.length; i++) {
            if (potentialMoves[i].score > bestScore) {
                bestScore = potentialMoves[i].score;
                bestMove = i;
            }
        }
    } else {
        let bestScore = 10000;
        for (let i = 0; i < potentialMoves.length; i++) {
            if (potentialMoves[i].score < bestScore) {
                bestScore = potentialMoves[i].score;
                bestMove = i;
            }
        }
    }
    return potentialMoves[bestMove];
};