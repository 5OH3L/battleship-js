const container = document.getElementById("container");
const playerContainer = document.getElementById("player-container");
const playerBoard = document.getElementById("player-board");
const computerContainer = document.getElementById("computer-container");
const computerBoard = document.getElementById("computer-board");

function renderBoard(player, DOMBoard) {
  for (let i = 0; i < player.gameboard.board.length; i++) {
    for (let j = 0; j < player.gameboard.board[i].length; j++) {
      const cell = document.createElement("div");
      cell.className = `cell row${i} column${j}`;
      [1, 2, 3, 4, 5].forEach(shipIndex => {
        if (player.gameboard.board[i][j] === shipIndex) cell.classList.add("ship", `ship${shipIndex}`);
      });
      cell.dataset.row = i;
      cell.dataset.column = j;
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
const DOM = {
  renderPlayerBoard,
  renderComputerBoard,
};

export default DOM;
