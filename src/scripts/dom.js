import { computer, player } from "../../battleship";

const playerBoard = document.getElementById("player-board");
const computerBoard = document.getElementById("computer-board");
const playerTurn = document.getElementById("player-turn");

let isPlayerTurn;

function init() {
  setTimeout(() => {
    document.getElementById("message-container").removeAttribute("style");
  }, 500);
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
          if (player.gameboard.board[i][j] === -1) {
            isPlayerTurn = !isPlayerTurn;
            computerBoard.style.pointerEvents = "none";
            setTimeout(() => {
              displayTurn(isPlayerTurn);
              switchTurn(isPlayerTurn);
              if (!isPlayerTurn) computerShoot(player1, player2);
            }, 1000);
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
  console.log(cell);
  refreshCells(player, [cell]);
  if (player.gameboard.board[attackX][attackY] === -1) {
    isPlayerTurn = !isPlayerTurn;
    computerBoard.style.pointerEvents = "none";
    setTimeout(() => {
      displayTurn(isPlayerTurn);
      switchTurn(isPlayerTurn);
    }, 1000);
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
