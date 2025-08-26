import Player from "./player.js";

function initializePlayers() {
  const player = Player("Player");
  const computer = Player("Computer");

  // Populate computer's gameboard
  computer.gameboard.placeShip([3, 9], 1);
  computer.gameboard.placeShip([6, 7], 2);
  computer.gameboard.placeShip([8, 3], 3, true);
  computer.gameboard.placeShip([4, 2], 4, true);
  computer.gameboard.placeShip([1, 1], 5, true);
  return [player, computer];
}

let [player, computer] = initializePlayers();

const playerBoard = document.getElementById("player-board");
const computerBoard = document.getElementById("computer-board");
const playerTurn = document.getElementById("player-turn");
const messageContainer = document.getElementById("message-container");
const messageTitle = document.getElementById("message-title");
const messageText = document.getElementById("message-text");
const messageAcionButton = document.getElementById("message-action");

let isPlayerTurn;

function init() {
  setTimeout(() => {
    document.getElementById("message-container").removeAttribute("style");
  }, 500);
  messageAcionButton.addEventListener("click", () => {
    messageContainer.classList.remove("show");
    [player, computer] = initializePlayers();
  });
  renderBoards(player, computer, playerBoard, computerBoard);
  computerBoard.style.pointerEvents = "none";
}

function refreshCells(player, cells) {
  cells.forEach(cell => {
    const board = player.gameboard.board;
    const x = Number(cell.dataset.row);
    const y = Number(cell.dataset.column);
    if (board[x][y] === -1 || board[x][y] === -2) {
      cell.classList.add("shot");
    }
  });
}

function isGameOver(player1, player2) {
  if (player2.gameboard.allShipsSunk) return 1;
  if (player1.gameboard.allShipsSunk) return 2;
  return false;
}

function showMessage(title, text, buttonText, player1Name = null, player2Name = null) {
  messageContainer.classList.add("show");
  messageTitle.textContent = title;
  if (player1Name && player2Name) {
    messageText.innerHTML = `<strong>${player1Name}</strong> ${text} <strong>${player2Name}</strong>.`;
  } else messageText.textContent = text;
  messageAcionButton.textContent = buttonText;
}

function renderBoards(player1, player2, player1DOMBoard, player2DOMBoard) {
  renderPlayerBoard(player1, player1DOMBoard);
  renderPlayerBoard(player2, player2DOMBoard);
  function renderPlayerBoard(player, DOMBoard) {
    DOMBoard.innerHTML = "";
    for (let i = 0; i < player.gameboard.board.length; i++) {
      for (let j = 0; j < player.gameboard.board[i].length; j++) {
        const cellValue = player.gameboard.board[i][j];
        const cell = document.createElement("div");
        cell.className = `cell row${i} column${j}`;
        [1, 2, 3, 4, 5].forEach(shipIndex => {
          if (cellValue === shipIndex) cell.classList.add("ship", `ship${shipIndex}`);
        });
        if (cellValue === -1 || cellValue === -2) {
          cell.classList.add("shot");
          cell.dataset.shot = "";
        }
        cell.dataset.row = i;
        cell.dataset.column = j;
        cell.addEventListener("click", () => {
          if (cell.dataset.shot === "") return;
          player.gameboard.receiveAttack(i, j);
          refreshCells(player, [cell]);
          const gameOver = isGameOver(player, computer);
          if (gameOver) {
            gameOver === 1
              ? showMessage("Game Over!", "has sunk all of the ships of", "Restart", player1.name, player2.name)
              : showMessage("Game Over!", "has sunk all of the ships of", "Restart", player2.name, player1.name);
            return;
          } else if (player.gameboard.board[i][j] === -1) {
            isPlayerTurn = !isPlayerTurn;
            computerBoard.style.pointerEvents = "none";
            displayTurn(isPlayerTurn);
            switchTurn(isPlayerTurn);
            if (!isPlayerTurn) computerShoot(player1, player2);
          }
        });
        DOMBoard.appendChild(cell);
      }
    }
  }
}

function computerShoot(player, computer) {
  const [attackX, attackY] = computer.shoot();
  player.gameboard.receiveAttack(attackX, attackY);
  const cell = document.querySelector(`.row${attackX}.column${attackY}`);
  cell.classList.add("shot");
  refreshCells(player, [cell]);
  const gameOver = isGameOver(player, computer);
  if (gameOver) {
    gameOver === 1
      ? showMessage("Game Over!", "has sunk all of the ships of", "Restart", player.name, computer.name)
      : showMessage("Game Over!", "has sunk all of the ships of", "Restart", computer.name, player.name);
    return;
  }
  if (player.gameboard.board[attackX][attackY] === -1) {
    isPlayerTurn = !isPlayerTurn;
    computerBoard.style.pointerEvents = "none";
    displayTurn(isPlayerTurn);
    switchTurn(isPlayerTurn);
  } else computerShoot(player, computer);
}

function displayTurn(isPlayerTurn) {
  playerTurn.textContent = `${isPlayerTurn ? "Player" : "Computer"}'s Turn`;
}
function switchTurn(isPlayerTurn) {
  if (isPlayerTurn) {
    playerBoard.classList.add("disabled");
    computerBoard.classList.remove("disabled");
    computerBoard.style.pointerEvents = "all";
  } else {
    computerBoard.classList.add("disabled");
    playerBoard.classList.remove("disabled");
    computerBoard.style.pointerEvents = "none";
  }
}

function startGame() {
  renderBoards(player, computer, playerBoard, computerBoard);
  isPlayerTurn = Math.random() < 0.5;
  displayTurn(isPlayerTurn);
  switchTurn(isPlayerTurn);
  if (!isPlayerTurn) computerShoot(player, computer);
}

const DOM = {
  startGame,
  init,
};

export default DOM;
