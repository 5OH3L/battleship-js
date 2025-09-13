import DOM from "./dom.js";
import Player from "./player.js";

const container = document.getElementById("container");
const player1DOMBoard = document.getElementById("player-1-board");
const player1ShipsContainer = document.getElementById("player-1-ships-container");
const player2DOMBoard = document.getElementById("player-2-board");
const ships = [...document.getElementsByClassName("ship")];
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

function init(playerName) {
  player = Player(playerName);
  computer = initComputer()
  DOM.renderPlayerBoard(player, player1DOMBoard);
  DOM.renderComputerBoard(computer, player2DOMBoard, player, player1DOMBoard);
  player2DOMBoard.style.pointerEvents = "none";
  player1ShipsContainer.classList.add("visible");
  player1Name.textContent = DOM.capitalize(player.name);
  player2Name.textContent = DOM.capitalize(computer.name);
  container.classList.add("computer");

  ships.forEach(ship => {
    ship.addEventListener("dragstart", () => {
      DOM.setDraggedShip(ship);
    });
    ship.addEventListener("dragend", () => {
      DOM.clearDraggedShip();
    });
  });
}

function computerShoot(computer, player) {
  const [attackX, attackY] = computer.shoot();
  player.gameboard.receiveAttack(attackX, attackY);
  const cell = player1DOMBoard.querySelector(`.row-${attackX}.column-${attackY}`);
  cell.classList.add("shot");
  cell.dataset.shot = "";
  DOM.refreshCell(player, cell);
  const gameOver = DOM.isGameOver(player, computer);
  if (gameOver) {
    gameOver === 1
      ? DOM.showMessage("Game Over!", "has sunk all of the ships of", "Restart", player.name, computer.name)
      : DOM.showMessage("Game Over!", "has sunk all of the ships of", "Restart", computer.name, player.name);
    return;
  }
  if (player.gameboard.board[attackX][attackY] === -1) {
    DOM.isPlayerTurn = !DOM.isPlayerTurn;
    player2DOMBoard.style.pointerEvents = "none";
    DOM.displayTurn(DOM.isPlayerTurn, player.name, computer.name);
    DOM.switchTurn(DOM.isPlayerTurn, player1DOMBoard, player2DOMBoard);
  } else computerShoot(computer, player);
}

function startGame() {
  if (computer && player2DOMBoard) DOM.renderComputerBoard(computer, player2DOMBoard, player, player1DOMBoard);
  DOM.isPlayerTurn = Math.random() < 0.5;
  DOM.displayTurn(DOM.isPlayerTurn, player.name, computer.name);
  DOM.switchTurn(DOM.isPlayerTurn, player1DOMBoard, player2DOMBoard);
  if (!DOM.isPlayerTurn) computerShoot(computer, player);
}

const DOMComputer = {
  init,
  startGame,
  shoot: computerShoot,
  get player() {
    return player;
  },
  get computer() {
    return computer;
  },
};

export default DOMComputer;
