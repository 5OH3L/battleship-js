import DOMComputer from "./dom-computer.js";

const container = document.getElementById("container");
const DOMOverlay = document.getElementById("overlay");
const gameModeSelectionContainer = document.getElementById("game-mode-selection-container");
const gameModeComputer = document.getElementById("player-computer");
const playerInputContainer = document.getElementById("player-input-container");
const player1InputName = document.getElementById("player1-input-name-text");
const player2InputName = document.getElementById("player2-input-name-text");
const playerInputConfirmButton = document.getElementById("player-input-confirm-button");
const notification = document.getElementById("notification-message");
const shipsContainer = document.getElementById("ships-container");
const player1InputTitle = document.getElementById("player1-input-title");
const playerInputBackButton = document.getElementById("player-input-back-button");

function initDOM() {
  setTimeout(() => {
    document.getElementById("message-container").removeAttribute("style");
    shipsContainer.removeAttribute("style");
    playerInputContainer.removeAttribute("style");
    notification.removeAttribute("style");
  }, 500);

  gameModeComputer.addEventListener("click", () => {
    const isGameStarted = container.dataset.gameStarted === "true" ? true : false;
    if (isGameStarted) return;
    initGame();
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
      }
    }
  });

  playerInputBackButton.addEventListener("click", () => {
    gameModeSelectionContainer.classList.add("visible");
    playerInputContainer.classList.remove("visible");
  });
}

let notificationTiemoutID;

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

function getPlayerInput() {
  const player1Name = player1InputName.value.trim();
  const player2Name = player2InputName.value.trim();
  return { player1Name, player2Name };
}
function clearPlayerInput() {
  player1InputName.value = "";
  player2InputName.value = "";
}

function initGame() {
  gameModeSelectionContainer.classList.remove("visible");
  playerInputContainer.classList.add("visible");
  clearPlayerInput();
  player1InputTitle.textContent = "Enter Player's Name";
  player1InputName.focus();
}

function init() {
  initDOM();
}

export default {
  init,
};
