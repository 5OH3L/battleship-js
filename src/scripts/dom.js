import DOMComputer from "./dom-computer.js";
import DOMPlayer from "./dom-player.js";

const container = document.getElementById("container");
const DOMOverlay = document.getElementById("overlay");
const gameModeSelectionContainer = document.getElementById("game-mode-selection-container");
const gameModeComputer = document.getElementById("player-computer");
const gameModePlayer = document.getElementById("player-player");
const playerInputContainer = document.getElementById("player-input-container");
const player1InputName = document.getElementById("player1-input-name-text");
const player2InputName = document.getElementById("player2-input-name-text");
const playerInputConfirmButton = document.getElementById("player-input-confirm-button");
const notification = document.getElementById("notification-message");
const player1ShipsContainer = document.getElementById("player-1-ships-container");
const player2ShipsContainer = document.getElementById("player-2-ships-container");
const ships = [...document.getElementsByClassName("ship")];
const player1GameStartInstructions = document.getElementById("player-1-game-start-instructions");
const player1InputTitle = document.getElementById("player1-input-title");
const playerInputBackButton = document.getElementById("player-input-back-button");
const gameStartInstructions = [...document.getElementsByClassName("game-start-instructions")];
const orientationButtons = [...document.getElementsByClassName("orientation-button")];
const startButtons = [...document.getElementsByClassName("start-button")];
const playerTurn = document.getElementById("player-turn");
const player1ShipsContainerBackButton = document.getElementById("player-1-ships-container-back-button");
const player1ShipsContainerContinueButton = document.getElementById("player-1-ships-container-continue-button");
const player2ShipsContainerBackButton = document.getElementById("player-2-ships-container-back-button");
const player2ShipsContainerStartButton = document.getElementById("player-2-ships-container-start-button");
const player1DOMBoard = document.getElementById("player-1-board");
const player2DOMBoard = document.getElementById("player-2-board");
const messageContainer = document.getElementById("message-container");
const messageTitle = document.getElementById("message-title");
const messageText = document.getElementById("message-text");
const messageAcionButton = document.getElementById("message-action");

function initDOM() {
  setTimeout(() => {
    document.getElementById("message-container").removeAttribute("style");
    player1ShipsContainer.removeAttribute("style");
    player2ShipsContainer.removeAttribute("style");
    playerInputContainer.removeAttribute("style");
    notification.removeAttribute("style");
  }, 500);

  messageAcionButton.addEventListener("click", () => {
    messageContainer.classList.remove("show");
    playerInputContainer.classList.add("visible");
    DOMOverlay.classList.add("visible");
    container.classList.remove("game-started");
    container.dataset.gameStarted = false;
    player1DOMBoard.classList.remove("disabled");
    player2DOMBoard.classList.add("disabled");
    ships.forEach(ship => ship.classList.remove("placed"));
    playerTurn.textContent = "---";
    player1InputName.select();
  });

  gameModeComputer.addEventListener("click", () => {
    const gameStarted = hasGameStarted();
    if (gameStarted) return;
    initGame(true);
  });

  gameModePlayer.addEventListener("click", () => {
    const gameStarted = hasGameStarted();
    if (gameStarted) return;
    initGame(false);
  });

  playerInputConfirmButton.addEventListener("click", () => {
    if (container.dataset.gamemode === "computer") {
      const { player1Name } = getPlayerInput();
      if (player1Name === "") {
        showNotification("Enter player's name", 5);
      } else if (player1Name.toLowerCase() === "computer") {
        showNotification('Player name can\'t be "computer"', 5);
      } else {
        playerInputContainer.classList.remove("visible");
        DOMOverlay.classList.remove("visible");
        DOMComputer.init(player1Name);
        player1ShipsContainerContinueButton.textContent = "Start";
        showInstruction(null, false);
      }
    } else if (container.dataset.gamemode === "player") {
      const { player1Name, player2Name } = getPlayerInput();
      if (player1Name === "" && player2Name === "") {
        showNotification("Enter both player's name", 5);
      } else if (player1Name === "") {
        showNotification("Enter player - 1's name", 5);
      } else if (player2Name === "") {
        showNotification("Enter player - 2's name", 5);
      } else if (player1Name.toLowerCase() === "computer") {
        showNotification("Player - 1's name can't be \"computer\"", 5);
      } else if (player2Name.toLowerCase() === "computer") {
        showNotification("Player - 2's name can't be \"computer\"", 5);
      } else {
        playerInputContainer.classList.remove("visible");
        DOMOverlay.classList.remove("visible");
        DOMPlayer.init(player1Name, player2Name);
        player1ShipsContainerContinueButton.textContent = "Continue";
        showInstruction(null, false);
      }
    }
  });

  playerInputBackButton.addEventListener("click", () => {
    gameModeSelectionContainer.classList.add("visible");
    playerInputContainer.classList.remove("visible");
  });
  orientationButtons.forEach(orientationButton => {
    orientationButton.addEventListener("click", () => {
      const shipsContainer = orientationButton.parentElement.parentElement;
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
  });
  startButtons.forEach(startButton => {
    startButton.addEventListener("click", () => {
      const shipsContainer = startButton.parentElement;
      shipsContainer.classList.remove("visible");
      DOMPlayer.startGame();
      container.dataset.gameStarted = true;
      container.classList.add("game-started");
    });
  });

  window.addEventListener("keydown", event => {
    // if (event.key === "Enter" && container.dataset.gameStarted !== "true") startButton.click();
    if (event.key === "Control" && container.dataset.gameStarted !== "true") {
      orientationButtons.forEach(orientationButton => {
        const shipsContainer = orientationButton.parentElement.parentElement;
        if (!shipsContainer.classList.contains("visible")) return;
        if (shipsContainer.classList.contains("vertical")) {
          shipsContainer.classList.remove("vertical");
          shipsContainer.dataset.isHorizontal = true;
        } else {
          shipsContainer.classList.add("vertical");
          shipsContainer.dataset.isHorizontal = false;
        }
      });
    }
  });

  window.startGame = function () {
    if (container.dataset.gamemode === "computer") {
      const allPlayer1PlacedShipNumbers = getAllPlacedShipNumbers(DOMPlayer.playerOne.gameboard.board);
      if (allPlayer1PlacedShipNumbers.length === 5) {
        DOMComputer.startGame();
      } else {
        throw new Error("All ships must be placed to start the game!");
      }
    } else {
      const allPlayer1PlacedShipNumbers = getAllPlacedShipNumbers(DOMPlayer.playerOne.gameboard.board);
      const allPlayer2PlacedShipNumbers = getAllPlacedShipNumbers(DOMPlayer.playerTwo.gameboard.board);
      if (allPlayer1PlacedShipNumbers.length === 5 && allPlayer2PlacedShipNumbers.length === 5) {
        DOMPlayer.startGame();
      } else {
        throw new Error("All ships must be placed to start the game!");
      }
    }
  };
  ships.forEach(ship => {
    ship.addEventListener("dragstart", () => {
      setDraggedShip(ship);
    });
    ship.addEventListener("dragend", () => {
      clearDraggedShip();
    });
  });

  player1ShipsContainerBackButton.addEventListener("click", () => {
    player1ShipsContainer.classList.remove("visible");
    playerInputContainer.classList.add("visible");
    DOMOverlay.classList.add("visible");
    [...player1ShipsContainer.getElementsByClassName("ship")].forEach(ship => {
      ship.classList.remove("placed");
    });
  });

  player1ShipsContainerContinueButton.addEventListener("click", () => {
    if (container.dataset.gamemode === "computer") {
      try {
        if (getAllPlacedShipNumbers(DOMComputer.player.gameboard.board).length === 5) {
          player1ShipsContainer.classList.remove("visible");
          DOMComputer.startGame();
          container.dataset.gameStarted = true;
          container.classList.add("game-started");
        } else {
          throw new Error("All ships must be placed to start the game!");
        }
      } catch (error) {
        player1GameStartInstructions.textContent = error.message;
        player1GameStartInstructions.classList.add("error");
        console.error(error.message);
      }
    } else {
      try {
        if (getAllPlacedShipNumbers(DOMPlayer.playerOne.gameboard.board).length === 5) {
          player1ShipsContainer.classList.remove("visible");
          player2ShipsContainer.classList.add("visible");
          player1DOMBoard.classList.add("disabled");
          player1DOMBoard.style.pointerEvents = "none";
          player2DOMBoard.classList.remove("disabled");
          player2DOMBoard.style.pointerEvents = "all";
        } else {
          throw new Error("All ships must be placed to continue the game!");
        }
      } catch (error) {
        player1GameStartInstructions.textContent = error.message;
        player1GameStartInstructions.classList.add("error");
        console.error(error.message);
      }
    }
  });

  player2ShipsContainerBackButton.addEventListener("click", () => {
    player2ShipsContainer.classList.remove("visible");
    player1ShipsContainer.classList.add("visible");
    const { player2Name } = getPlayerInput();
    DOMPlayer.init(null, player2Name);
    [...player2ShipsContainer.getElementsByClassName("ship")].forEach(ship => {
      ship.classList.remove("placed");
    });
  });
  player2ShipsContainerStartButton.addEventListener("click", () => {
    window.startGame();
    player2ShipsContainer.classList.remove("visible");
    player1DOMBoard.removeAttribute("style");
    player2DOMBoard.removeAttribute("style");
    container.dataset.gameStarted = "true";
    container.classList.add("game-started");
  });
}

let notificationTiemoutID;
let draggedShip = null;
let isPlayerTurn;

function showNotification(message, time) {
  if (notification.classList.contains("visible")) {
    clearTimeout(notificationTiemoutID);
    notificationTiemoutID = setTimeout(() => {
      notification.classList.remove("visible");
    }, time * 1000);
  } else {
    notification.classList.add("visible");
    notificationTiemoutID = setTimeout(() => {
      notification.classList.remove("visible");
    }, time * 1000);
  }
  notification.textContent = message;
}

function hasGameStarted() {
  return container.dataset.gameStarted === "true" ? true : false;
}

function getPlayerInput() {
  const player1Name = player1InputName.value.trim();
  const player2Name = player2InputName.value.trim();
  return { player1Name, player2Name };
}
function clearPlayerInput() {
  player1InputName.value = "";
  player2InputName.value = "";
}

function initGame(isComputerMode = false) {
  gameModeSelectionContainer.classList.remove("visible");
  playerInputContainer.classList.add("visible");
  clearPlayerInput();
  if (isComputerMode) {
    player1InputTitle.textContent = "Enter Player's Name";
    playerInputContainer.classList.remove("player");
    container.dataset.gamemode = "computer";
    container.classList.remove("player");
    container.classList.add("computer");
  } else {
    player1InputTitle.textContent = "Enter Player - 1's Name";
    playerInputContainer.classList.add("player");
    container.dataset.gamemode = "player";
    container.classList.remove("computer");
    container.classList.add("player");
  }
  player1InputName.select();
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
  manageDOMShipPlacement(player, playerDOMBoard);
  [...playerDOMBoard.children].forEach(cell => {
    cell.addEventListener("click", () => {
      manageCellAttack(player, cell);
    });
  });
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
        const gameOver = isGameOver(player, computer);
        if (gameOver) {
          gameOver === 1
            ? showMessage("Game Over!", "has sunk all of the ships of", "Restart", player.name, computer.name)
            : showMessage("Game Over!", "has sunk all of the ships of", "Restart", computer.name, player.name);
          return;
        } else if (computer.gameboard.board[i][j] === -1) {
          isPlayerTurn = !isPlayerTurn;
          computerDOMBoard.style.pointerEvents = "none";
          displayTurn(isPlayerTurn, player.name, computer.name);
          switchTurn(isPlayerTurn, playerDOMBoard, computerDOMBoard);
          if (!isPlayerTurn) DOMComputer.shoot(computer, player);
        }
      });
      computerDOMBoard.appendChild(cell);
    }
  }
}

function manageDOMShipPlacement(player, DOMBoard) {
  const cells = [...DOMBoard.children];
  cells.forEach(cell => {
    cell.addEventListener("dragover", event => {
      event.preventDefault();
      if (!draggedShip) return;
      const shipsContainer = draggedShip.parentElement.parentElement;
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
      const shipsContainer = draggedShip.parentElement.parentElement;
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
      const shipsContainer = draggedShip.parentElement.parentElement;
      const { x, y, shipLength, shipClassList, isHorizontal } = getPlacementData(cell, draggedShip, shipsContainer);
      try {
        player.gameboard.placeShip([x, y], parseInt(draggedShip.dataset.index), isHorizontal);
        if (isHorizontal) {
          for (let i = 0; i < shipLength; i++) {
            const DOMCell = getDOMCell([x, y + i], DOMBoard);
            if (DOMCell) DOMCell.classList.add(...shipClassList);
          }
        } else {
          for (let i = 0; i < shipLength; i++) {
            const DOMCell = getDOMCell([x + i, y], DOMBoard);
            if (DOMCell) DOMCell.classList.add(...shipClassList);
          }
        }
        draggedShip.classList.add("placed");
        showInstruction(null, false);
      } catch (error) {
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
        console.error(error);
        showInstruction(error.message);
      }
    });
  });

  cells.forEach(cell => {
    cell.addEventListener("click", () => {
      const hasGameStarted = container.dataset.gameStarted === "true" ? true : false;
      if (!hasGameStarted) return;
      const x = parseInt(cell.dataset.row);
      const y = parseInt(cell.dataset.column);
      try {
        player.gameboard.receiveAttack(x, y);
        refreshCell(player, cell);
        if (!cell.classList.contains("ship")) {
          isPlayerTurn = !isPlayerTurn;
          displayTurn(isPlayerTurn, DOMPlayer.playerOne.name, DOMPlayer.playerTwo.name);
          switchTurn(isPlayerTurn, player1DOMBoard, player2DOMBoard);
        }
        const gameOver = isGameOver(DOMPlayer.playerOne, DOMPlayer.playerTwo);
        if (gameOver) {
          gameOver === 1
            ? showMessage(
                "Game Over!",
                "has sunk all of the ships of",
                "Restart",
                DOMPlayer.playerOne.name,
                DOMPlayer.playerTwo.name
              )
            : showMessage(
                "Game Over!",
                "has sunk all of the ships of",
                "Restart",
                DOMPlayer.playerTwo.name,
                DOMPlayer.playerOne.name
              );
          return;
        }
      } catch (error) {
        console.error(error);
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

function manageCellAttack(player, DOMCell) {
  if (!hasGameStarted()) return;
  const x = parseInt(DOMCell.dataset.row);
  const y = parseInt(DOMCell.dataset.column);
  try {
    player.gameboard.receiveAttack(x, y);
  } catch (error) {
    console.log(error);
  }
}

function getDOMCell(coordinates, DOMBoard) {
  if (!coordinates || !DOMBoard) return false;
  const x = parseInt(coordinates[0]);
  const y = parseInt(coordinates[1]);
  return DOMBoard.querySelector(`.cell.row-${x}.column-${y}`);
}

function setDraggedShip(DOMShip) {
  draggedShip = DOMShip;
}
function clearDraggedShip() {
  draggedShip = null;
}
function refreshCell(player, cell) {
  const board = player.gameboard.board;
  const x = Number(cell.dataset.row);
  const y = Number(cell.dataset.column);
  if (board[x][y] === -1 || board[x][y] === -2) {
    cell.classList.add("shot");
    cell.dataset.shot = "";
  }
}
function showInstruction(errorMessage = null, show = true, clear = false) {
  let DOMInstruction = null;
  gameStartInstructions.forEach(gameStartInstruction => {
    const shipsContainer = gameStartInstruction.parentElement.parentElement;
    if (shipsContainer.classList.contains("visible")) DOMInstruction = gameStartInstruction;
  });
  if (DOMInstruction && show && errorMessage) {
    DOMInstruction.textContent = errorMessage;
    DOMInstruction.classList.add("error");
  } else {
    DOMInstruction.textContent = "Place all of your ships on the board to start the game";
    DOMInstruction.classList.remove("error");
    if (clear) DOMInstruction.textContent = "";
  }
}

function displayTurn(isPlayerTurn, player1Name, player2Name) {
  playerTurn.textContent = `${isPlayerTurn ? capitalize(player1Name) : capitalize(player2Name)}'s Turn`;
}

function switchTurn(isPlayerTurn, player1DOMBoard, player2DOMBoard) {
  if (isPlayerTurn) {
    player1DOMBoard.classList.add("disabled");
    player2DOMBoard.classList.remove("disabled");
  } else {
    player2DOMBoard.classList.add("disabled");
    player1DOMBoard.classList.remove("disabled");
  }
}

function getAllPlacedShipNumbers(board) {
  const allPlacedShipNumbers = new Set();
  for (let i = 0; i < board.length; i++)
    for (let j = 0; j < board[i].length; j++) if ([1, 2, 3, 4, 5].includes(board[i][j])) allPlacedShipNumbers.add(board[i][j]);
  return [...allPlacedShipNumbers];
}

function capitalize(string) {
  return string[0].toUpperCase() + string.toLowerCase().slice(1);
}

function init() {
  initDOM();
}

export default {
  init,
  renderPlayerBoard,
  renderComputerBoard,
  setDraggedShip,
  clearDraggedShip,
  displayTurn,
  switchTurn,
  capitalize,
  isGameOver,
  refreshCell,
  getAllPlacedShipNumbers,
  get isPlayerTurn() {
    return isPlayerTurn;
  },
  set isPlayerTurn(newPlayerTurn) {
    isPlayerTurn = newPlayerTurn;
  },
  showMessage,
};
