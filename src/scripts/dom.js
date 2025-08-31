import Player from "./player.js";

const container = document.getElementById("container");
const playerBoard = document.getElementById("player-board");
const computerBoard = document.getElementById("computer-board");
const playerTurn = document.getElementById("player-turn");
const shipsContainer = document.getElementById("ships-container");
const ships = [...document.getElementsByClassName("ship")];
const orientationButton = document.getElementById("orientation-button");
const startButton = document.getElementById("start-button");
const gameStartInstructions = document.getElementById("game-start-instructions");
const messageContainer = document.getElementById("message-container");
const messageTitle = document.getElementById("message-title");
const messageText = document.getElementById("message-text");
const messageAcionButton = document.getElementById("message-action");

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

let isPlayerTurn;
let draggedShip = null;

function init() {
  setTimeout(() => {
    document.getElementById("message-container").removeAttribute("style");
  }, 500);
  messageAcionButton.addEventListener("click", () => {
    messageContainer.classList.remove("show");
    [player, computer] = initializePlayers();
    renderBoards(player, playerBoard, computer, computerBoard);
    container.classList.remove("started");
    container.dataset.gameStarted = false;
    ships.forEach(ship => ship.classList.remove("placed"));
    manageDOMShipPlacement([...playerBoard.children]);
    showInstruction(null, false, false);
  });
  renderBoards(player, playerBoard, computer, computerBoard);
  computerBoard.style.pointerEvents = "none";

  startButton.addEventListener("click", () => {
    try {
      window.startGame();
      showInstruction(null, false, true);
      container.classList.add("started");
      container.dataset.gameStarted = true;
    } catch (error) {
      console.error(error);
      showInstruction(error.message);
    }
  });

  orientationButton.addEventListener("click", () => {
    if (shipsContainer.classList.contains("vertical")) {
      shipsContainer.removeAttribute("class");
      shipsContainer.dataset.isHorizontal = "true";
      orientationButton.textContent = "Vertical (ctrl)";
    } else {
      shipsContainer.classList.add("vertical");
      shipsContainer.dataset.isHorizontal = "false";
      orientationButton.textContent = "Horizontal (ctrl)";
    }
  });

  ships.forEach(ship => {
    ship.addEventListener("dragstart", () => {
      draggedShip = ship;
    });
    ship.addEventListener("dragend", () => {
      draggedShip = null;
    });
  });
  manageDOMShipPlacement([...playerBoard.children]);

  window.placeShip = function (coordinates, shipNumber, isHorizontal) {
    player.gameboard.placeShip(coordinates, shipNumber, isHorizontal);
    renderBoards(player, playerBoard);
  };
  window.startGame = function () {
    const allPlayerPlacedShipNumbers = getAllPlacedShipNumbers(player.gameboard.board);
    const allComputerPlacedShipNumbers = getAllPlacedShipNumbers(computer.gameboard.board);
    if (allPlayerPlacedShipNumbers.length === 5 && allComputerPlacedShipNumbers.length === 5) {
      startGame(player, null, computer, null);
    } else {
      throw new Error("All ships must be placed to start the game!");
    }
  };
  window.addEventListener("keydown", event => {
    if (event.key === "Enter" && container.dataset.gameStarted !== "true") startButton.click();
    if (event.key === "Control" && container.dataset.gameStarted !== "true") orientationButton.click();
  });
}

function getDOMCell(coordinates, DOMBoard) {
  if (!coordinates || !DOMBoard) return false;
  const x = parseInt(coordinates[0]);
  const y = parseInt(coordinates[1]);
  return DOMBoard.querySelector(`.cell.row-${x}.column-${y}`);
}

function showInstruction(errorMessage = null, show = true, clear = false) {
  if (show && errorMessage) {
    gameStartInstructions.textContent = errorMessage;
    gameStartInstructions.classList.add("error");
  } else {
    gameStartInstructions.textContent = "Place all of your ships on the board to start the game";
    gameStartInstructions.classList.remove("error");
    if (clear) gameStartInstructions.textContent = "";
  }
}

function manageDOMShipPlacement(cells) {
  cells.forEach(cell => {
    cell.addEventListener("dragover", event => {
      event.preventDefault();
      if (!draggedShip) return;
      const { x, y, shipLength, shipClassList, isHorizontal } = getPlacementData(cell, draggedShip, shipsContainer);
      if (isHorizontal) {
        for (let i = 0; i < shipLength; i++) {
          const DOMCell = getDOMCell([x, y + i], playerBoard);
          if (DOMCell) DOMCell.classList.add(shipClassList[1]);
        }
      } else {
        for (let i = 0; i < shipLength; i++) {
          const DOMCell = getDOMCell([x + i, y], playerBoard);
          if (DOMCell) DOMCell.classList.add(shipClassList[1]);
        }
      }
    });
    cell.addEventListener("dragleave", () => {
      if (!draggedShip) return;
      const { x, y, shipLength, shipClassList, isHorizontal } = getPlacementData(cell, draggedShip, shipsContainer);
      if (isHorizontal) {
        for (let i = 0; i < shipLength; i++) {
          const DOMCell = getDOMCell([x, y + i], playerBoard);
          if (DOMCell) DOMCell.classList.remove(shipClassList[1]);
        }
      } else {
        for (let i = 0; i < shipLength; i++) {
          const DOMCell = getDOMCell([x + i, y], playerBoard);
          if (DOMCell) DOMCell.classList.remove(shipClassList[1]);
        }
      }
    });
    cell.addEventListener("drop", event => {
      event.preventDefault();
      if (!draggedShip) return;
      const { x, y, shipLength, shipClassList, isHorizontal } = getPlacementData(cell, draggedShip, shipsContainer);
      try {
        player.gameboard.placeShip([x, y], parseInt(draggedShip.dataset.index), isHorizontal);
        if (isHorizontal) {
          for (let i = 0; i < shipLength; i++) {
            const DOMCell = getDOMCell([x, y + i], playerBoard);
            if (DOMCell) DOMCell.classList.add(...shipClassList);
          }
        } else {
          for (let i = 0; i < shipLength; i++) {
            const DOMCell = getDOMCell([x + i, y], playerBoard);
            if (DOMCell) DOMCell.classList.add(...shipClassList);
          }
        }
        draggedShip.classList.add("placed");
        showInstruction(null, false);
      } catch (error) {
        if (isHorizontal) {
          for (let i = 0; i < shipLength; i++) {
            const DOMCell = getDOMCell([x, y + i], playerBoard);
            if (DOMCell) DOMCell.classList.remove(shipClassList[1]);
          }
        } else {
          for (let i = 0; i < shipLength; i++) {
            const DOMCell = getDOMCell([x + i, y], playerBoard);
            if (DOMCell) DOMCell.classList.remove(shipClassList[1]);
          }
        }
        console.error(error);
        showInstruction(error.message);
      }
    });
  });

  function getPlacementData(cell, ship, shipsContainer) {
    const x = parseInt(cell.dataset.row);
    const y = parseInt(cell.dataset.column);
    const shipLength = parseInt(ship.dataset.length);
    const shipClassList = [...ship.classList];
    const isHorizontal = shipsContainer.dataset.isHorizontal === "true" ? true : false;
    return {
      x,
      y,
      shipLength,
      shipClassList,
      isHorizontal,
    };
  }
}

function getAllPlacedShipNumbers(board) {
  const allPlacedShipNumbers = new Set();
  for (let i = 0; i < board.length; i++)
    for (let j = 0; j < board[i].length; j++) if ([1, 2, 3, 4, 5].includes(board[i][j])) allPlacedShipNumbers.add(board[i][j]);
  return [...allPlacedShipNumbers];
}

function refreshCell(player, cell) {
  const board = player.gameboard.board;
  const x = Number(cell.dataset.row);
  const y = Number(cell.dataset.column);
  if (board[x][y] === -1 || board[x][y] === -2) {
    cell.classList.add("shot");
  }
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

function renderBoards(player1, player1DOMBoard, player2, player2DOMBoard) {
  if (player1 && player1DOMBoard) renderPlayerBoard(player1, player1DOMBoard);
  if (player2 && player2DOMBoard) renderPlayerBoard(player2, player2DOMBoard);
  function renderPlayerBoard(player, DOMBoard) {
    DOMBoard.innerHTML = "";
    for (let i = 0; i < player.gameboard.board.length; i++) {
      for (let j = 0; j < player.gameboard.board[i].length; j++) {
        const cellValue = player.gameboard.board[i][j];
        const cell = document.createElement("div");
        cell.className = `cell row-${i} column-${j}`;
        [1, 2, 3, 4, 5].forEach(shipIndex => {
          if (cellValue === shipIndex) cell.classList.add("ship", `ship-${shipIndex}`);
        });
        if (cellValue === -1 || cellValue === -2) {
          cell.classList.add("shot");
          cell.dataset.shot = "";
        }
        cell.dataset.row = i;
        cell.dataset.column = j;
        if (player.name.toLowerCase() === "computer") {
          cell.addEventListener("click", () => {
            if (cell.dataset.shot === "") return;
            player.gameboard.receiveAttack(i, j);
            refreshCell(player, cell);
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
        }
        DOMBoard.appendChild(cell);
      }
    }
  }
}

function computerShoot(player, computer) {
  const [attackX, attackY] = computer.shoot();
  player.gameboard.receiveAttack(attackX, attackY);
  const cell = document.querySelector(`.row-${attackX}.column-${attackY}`);
  cell.classList.add("shot");
  refreshCell(player, cell);
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

function startGame(player, playerBoard, computer, computerBoard) {
  if (player && playerBoard) renderBoards(player, playerBoard);
  if (computer && computerBoard) renderBoards(computer, computerBoard);
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
