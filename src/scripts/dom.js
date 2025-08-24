const playerBoard = document.getElementById("player-board");
const computerBoard = document.getElementById("computer-board");
const playerTurn = document.getElementById("player-turn");

let isPlayerTurn;

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

function renderBoard(player, DOMBoard) {
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
      });
      DOMBoard.appendChild(cell);
    }
  }
}
function renderPlayerBoard(player) {
  renderBoard(player, playerBoard);
}
function renderComputerBoard(player) {
  renderBoard(player, computerBoard);
}

function displayTurn(isPlayerTurn) {
  playerTurn.textContent = `${isPlayerTurn ? "Player" : "Computer"}'s Turn`;
}

function startGame() {
  isPlayerTurn = Math.random() < 0.5;
  displayTurn(isPlayerTurn);
}

const DOM = {
  startGame,
  renderPlayerBoard,
  renderComputerBoard,
};

export default DOM;
