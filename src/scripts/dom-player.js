import DOM from "./dom.js";
import Player from "./player.js";

const player1DOMName = document.getElementById("player-1-name");
const player1DOMBoard = document.getElementById("player-1-board");
const player1ShipsContainer = document.getElementById("player-1-ships-container");
const player2DOMName = document.getElementById("player-2-name");
const player2DOMBoard = document.getElementById("player-2-board");

let player1;
let player2;

function init(player1Name, player2Name) {
  if (player1Name) {
    player1 = Player(player1Name);
    player1DOMName.textContent = DOM.capitalize(player1Name);
    DOM.renderPlayerBoard(player1, player1DOMBoard);
    player1ShipsContainer.classList.add("visible");
    player1DOMBoard.style.pointerEvents = "all";
    player2DOMBoard.style.pointerEvents = "none";
  }
  if (player2Name) {
    player2 = Player(player2Name);
    player2DOMName.textContent = DOM.capitalize(player2Name);
    DOM.renderPlayerBoard(player2, player2DOMBoard);
  }
}

function startGame() {
  if (player1 && player1DOMBoard) DOM.renderPlayerBoard(player1, player1DOMBoard);
  if (player2 && player2DOMBoard) DOM.renderPlayerBoard(player2, player2DOMBoard);
  DOM.isPlayerTurn = Math.random() < 0.5;
  DOM.displayTurn(DOM.isPlayerTurn, player1.name, player2.name);
  DOM.switchTurn(DOM.isPlayerTurn, player1DOMBoard, player2DOMBoard);
}

export default {
  init,
  startGame,
  get playerOne() {
    return player1;
  },
  get playerTwo() {
    return player2;
  },
};
