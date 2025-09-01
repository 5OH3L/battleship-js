import Player from "./player.js";

const container = document.getElementById("container");
const player1DOMBoard = document.getElementById("player-1-board");
const player2DOMBoard = document.getElementById("player-2-board");
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
const player1Name = document.getElementById("player-1-name");
const player2Name = document.getElementById("player-2-name");

let player;
let computer = initComputer();

function initComputer() {
  const computer = Player("Computer");

  // Populate computer's gameboard
  computer.gameboard.placeShip([3, 9], 1);
  computer.gameboard.placeShip([6, 7], 2);
  computer.gameboard.placeShip([8, 3], 3, true);
  computer.gameboard.placeShip([4, 2], 4, true);
  computer.gameboard.placeShip([1, 1], 5, true);
  return computer;
}

let isPlayerTurn;
let draggedShip = null;

function init(playerName) {
  messageAcionButton.addEventListener("click", () => {
    messageContainer.classList.remove("show");
    computer = initComputer();
    player = Player(player.name);
    renderPlayerBoard(player, player1DOMBoard);
    renderComputerBoard(computer, player2DOMBoard, player, player1DOMBoard);
    container.classList.remove("started");
    container.dataset.gameStarted = false;
    player1DOMBoard.style.pointerEvents = "all";
    player1DOMBoard.classList.remove("disabled");
    ships.forEach(ship => ship.classList.remove("placed"));
    showInstruction(null, false, false);
    playerTurn.textContent = "---";
    shipsContainer.classList.add("visible");
  });
  player = Player(playerName);
  renderPlayerBoard(player, player1DOMBoard);
  renderComputerBoard(computer, player2DOMBoard, player, player1DOMBoard);
  player2DOMBoard.style.pointerEvents = "none";

  shipsContainer.classList.add("visible");
  player1Name.textContent = capitalize(player.name);
  player2Name.textContent = capitalize(computer.name);

  startButton.addEventListener("click", () => {
    try {
      window.startGame();
      showInstruction(null, false, true);
      container.classList.add("started");
      container.dataset.gameStarted = true;
      shipsContainer.classList.remove("visible");
    } catch (error) {
      console.error(error);
      showInstruction(error.message);
    }
  });

  orientationButton.addEventListener("click", () => {
    if (shipsContainer.classList.contains("vertical")) {
      shipsContainer.classList.remove("vertical");
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

  window.placeShip = function (coordinates, shipNumber, isHorizontal) {
    player.gameboard.placeShip(coordinates, shipNumber, isHorizontal);
    renderPlayerBoard(player, player1DOMBoard);
    renderComputerBoard(computer, player2DOMBoard, player, player1DOMBoard);
  };
  window.startGame = function () {
    const allPlayerPlacedShipNumbers = getAllPlacedShipNumbers(player.gameboard.board);
    const allComputerPlacedShipNumbers = getAllPlacedShipNumbers(computer.gameboard.board);
    if (allPlayerPlacedShipNumbers.length === 5 && allComputerPlacedShipNumbers.length === 5) {
      startGame(player, player1DOMBoard, computer, player2DOMBoard);
    } else {
      throw new Error("All ships must be placed to start the game!");
    }
  };
  window.addEventListener("keydown", event => {
    if (event.key === "Enter" && container.dataset.gameStarted !== "true") startButton.click();
    if (event.key === "Control" && container.dataset.gameStarted !== "true") orientationButton.click();
  });
}

function capitalize(string) {
  return string[0].toUpperCase() + string.toLowerCase().slice(1);
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

function manageDOMShipPlacement(DOMBoard) {
  const cells = [...DOMBoard.children];
  cells.forEach(cell => {
    cell.addEventListener("dragover", event => {
      event.preventDefault();
      if (!draggedShip) return;
      const { x, y, shipLength, shipClassList, isHorizontal } = getPlacementData(cell, draggedShip, shipsContainer);
      if (isHorizontal) {
        for (let i = 0; i < shipLength; i++) {
          const DOMCell = getDOMCell([x, y + i], DOMBoard);
          if (DOMCell) DOMCell.classList.add(shipClassList[1]);
        }
      } else {
        for (let i = 0; i < shipLength; i++) {
          const DOMCell = getDOMCell([x + i, y], DOMBoard);
          if (DOMCell) DOMCell.classList.add(shipClassList[1]);
        }
      }
    });
    cell.addEventListener("dragleave", () => {
      if (!draggedShip) return;
      const { x, y, shipLength, shipClassList, isHorizontal } = getPlacementData(cell, draggedShip, shipsContainer);
      if (isHorizontal) {
        for (let i = 0; i < shipLength; i++) {
          const DOMCell = getDOMCell([x, y + i], DOMBoard);
          if (DOMCell) DOMCell.classList.remove(shipClassList[1]);
        }
      } else {
        for (let i = 0; i < shipLength; i++) {
          const DOMCell = getDOMCell([x + i, y], DOMBoard);
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
            const DOMCell = getDOMCell([x, y + i], player1DOMBoard);
            if (DOMCell) DOMCell.classList.add(...shipClassList);
          }
        } else {
          for (let i = 0; i < shipLength; i++) {
            const DOMCell = getDOMCell([x + i, y], player1DOMBoard);
            if (DOMCell) DOMCell.classList.add(...shipClassList);
          }
        }
        draggedShip.classList.add("placed");
        showInstruction(null, false);
      } catch (error) {
        if (isHorizontal) {
          for (let i = 0; i < shipLength; i++) {
            const DOMCell = getDOMCell([x, y + i], player1DOMBoard);
            if (DOMCell) DOMCell.classList.remove(shipClassList[1]);
          }
        } else {
          for (let i = 0; i < shipLength; i++) {
            const DOMCell = getDOMCell([x + i, y], player1DOMBoard);
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
    messageText.innerHTML = `<strong>${capitalize(player1Name)}</strong> ${text} <strong>${capitalize(player2Name)}</strong>.`;
  } else messageText.textContent = text;
  messageAcionButton.textContent = buttonText;
}

function renderPlayerBoard(player, playerDOMBoard) {
  playerDOMBoard.innerHTML = "";
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
      playerDOMBoard.appendChild(cell);
    }
  }
  manageDOMShipPlacement(playerDOMBoard);
}
function renderComputerBoard(computer, computerDOMBoard, player, playerDOMBoard) {
  computerDOMBoard.innerHTML = "";
  for (let i = 0; i < computer.gameboard.board.length; i++) {
    for (let j = 0; j < computer.gameboard.board[i].length; j++) {
      const cellValue = computer.gameboard.board[i][j];
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
      cell.addEventListener("click", () => {
        if (cell.dataset.shot === "") return;
        computer.gameboard.receiveAttack(i, j);
        refreshCell(computer, cell);
        const gameOver = isGameOver(computer, player);
        if (gameOver) {
          gameOver === 1
            ? showMessage("Game Over!", "has sunk all of the ships of", "Restart", computer.name, player.name)
            : showMessage("Game Over!", "has sunk all of the ships of", "Restart", player.name, computer.name);
          return;
        } else if (computer.gameboard.board[i][j] === -1) {
          isPlayerTurn = !isPlayerTurn;
          computerDOMBoard.style.pointerEvents = "none";
          displayTurn(isPlayerTurn, computer.name, player.name);
          switchTurn(isPlayerTurn, computerDOMBoard, playerDOMBoard);
          if (!isPlayerTurn) computerShoot(computer, player);
        }
      });
      computerDOMBoard.appendChild(cell);
    }
  }
}

function computerShoot(computer, player) {
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
    player2DOMBoard.style.pointerEvents = "none";
    displayTurn(isPlayerTurn, player.name, computer.name);
    switchTurn(isPlayerTurn, player1DOMBoard, player2DOMBoard);
  } else computerShoot(computer, player);
}

function displayTurn(isPlayerTurn, player1Name, player2Name) {
  playerTurn.textContent = `${isPlayerTurn ? capitalize(player1Name) : capitalize(player2Name)}'s Turn`;
}
function switchTurn(isPlayerTurn, player1DOMBoard, player2DOMBoard) {
  if (isPlayerTurn) {
    player1DOMBoard.classList.add("disabled");
    player2DOMBoard.classList.remove("disabled");
    player2DOMBoard.style.pointerEvents = "all";
  } else {
    player2DOMBoard.classList.add("disabled");
    player1DOMBoard.classList.remove("disabled");
    player2DOMBoard.style.pointerEvents = "none";
  }
}

function startGame(player1, player1DOMBoard, player2, player2Board) {
  if (player1 && player1DOMBoard) renderPlayerBoard(player1, player1DOMBoard);
  if (player2 && player2Board) renderComputerBoard(player2, player2Board, player1, player1DOMBoard);
  isPlayerTurn = Math.random() < 0.5;
  displayTurn(isPlayerTurn, player1.name, player2.name);
  switchTurn(isPlayerTurn, player1DOMBoard, player2Board);
  if (!isPlayerTurn) computerShoot(player2, player1);
}

const DOM = {
  init,
};

export default DOM;
