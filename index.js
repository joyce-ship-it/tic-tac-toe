
const gameBoard = (function () {
    const rows = 3;
    const columns = 3;
    let board = [];

    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push(" ");
        }
    }
    const getBoard = function () {
        return board;
    }
    const resetBoard = function () {
        board = [];
        for (let i = 0; i < rows; i++) {
            board[i] = [];
            for (let j = 0; j < columns; j++) {
                board[i].push(" ");
            }
        }
        return board;
    }
    const printBoard = function () {
        for (let i = 0; i < 3; i++) {
            console.log(board[i]);
        }
    }
    const checkAvailableCell = function (row, column) {
        if (board[row][column] === " ") {
            return true;
        }
        return false;
    }
    const insertValue = function (row, column, value) {
        if (checkAvailableCell(row, column)) {
            board[row][column] = value;
        }
        return board;
    }
    return { getBoard, checkAvailableCell, printBoard, insertValue, resetBoard };
})();


const Player = function (name, strike) {
    let playerName = name;
    let score = 0;
    let playerStrike = strike;
    const getPlayerName = function () {
        return playerName;
    }

    const getScore = function () {
        return score;
    }
    const incrementScore = function () {
        score++;
    }
    const getStrike = function () {
        return playerStrike;
    }
    const resetScore = function () {
        score = 0;
    }
    return { getPlayerName, getScore, getStrike, incrementScore, resetScore };
};

const gameController = (function () {
    let board = gameBoard.getBoard();
    const players = [Player('PlayerA', 'x'), Player('PlayerB', 'o')];
    let activePlayer = players[0];
    let result;
    gameBoard.printBoard(board);
    const checkWinner = function (board, value) {
        for (let i = 0; i < 3; i++) {
            if (board[i][0] === value && board[i][1] === value && board[i][2] === value) return true;
        }
        for (let i = 0; i < 3; i++) {
            if (board[0][i] === value && board[1][i] === value && board[2][i] === value) return true;
        }
        if (board[0][0] === value && board[1][1] === value && board[2][2] === value) return true;
        if (board[0][2] === value && board[1][1] === value && board[2][0] === value) return true;
        return false;
    }
    const checkTie = function (board) {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] === " ") {
                    return false;
                }
            }
        }
        return true;
    }
    const switchPlayer = function () {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    }
    const playRound = function (row, column) {
        console.log(`${activePlayer.getPlayerName()}'s turn`)
        gameBoard.insertValue(row, column, activePlayer.getStrike());

        if (checkWinner(board, activePlayer.getStrike())) {
            activePlayer.incrementScore();
            console.log(`${activePlayer.getPlayerName()} wins`);
            result = `${activePlayer.getPlayerName()} wins`;
        }
        else if (checkTie(board)) {
            console.log('Its a tie');
            result = `Its a tie`;
        }
        console.log(`${activePlayer.getPlayerName()} : ${activePlayer.getScore()}`);
        gameBoard.printBoard();
        switchPlayer();
    }
    const getResult = function () {
        return result;
    }
    const getActivePlayer = function () {
        return activePlayer;
    }
    const reset = function () {
        board = gameBoard.resetBoard();
        players[0].resetScore();
        players[1].resetScore();
        result = '';
        activePlayer = players[0];

        return board;
    }

    return { playRound, board, getActivePlayer, getResult, reset }

})();

// const game = gameController;
// game.playRound(0, 0);
// game.playRound(0, 1);
// game.playRound(0, 2);
// game.playRound(1, 0);
// game.playRound(1, 1);
// game.playRound(1,2);
// game.reset();
// game.playRound(2,0);

const screenController = function () {
    const game = gameController;
    const turn = document.querySelector('.turn');
    let board = game.board;

    
    const result = document.querySelector('.result');
    let boardDiv = document.querySelector('.board');
    let resetBtn = document.querySelector('.reset');
    
    let updateScreen = function () {
        turn.textContent = `${game.getActivePlayer().getPlayerName()}'s turn`;
        boardDiv.textContent = '';
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                const cell = document.createElement('button');
                cell.classList.add('cell');
                cell.setAttribute('data-row', i);
                cell.setAttribute('data-column', j);
                cell.textContent = board[i][j];
                boardDiv.append(cell);
                cell.addEventListener('click', cellClickHandler);
            }
        }
        result.textContent = game.getResult();
    }
    const cellClickHandler = function (e) {
        const row = +e.target.dataset.row;
        const column = +e.target.dataset.column;
        game.playRound(row, column);
        if(result.textContent === ''){
            updateScreen();
        }
    }
    const resetHandler = function () {
        board = game.reset();
        updateScreen();
    }
    resetBtn.addEventListener('click', resetHandler);
    updateScreen();

}
screenController();