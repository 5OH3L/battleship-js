import Gameboard from "./gameboard.js";

function Player(playerName) {
  let name = playerName || null;
  const gameboard = Gameboard();
  if (playerName.toLowerCase() === "computer") {
    const availableShots = [];
    for (let i = 0; i < gameboard.board.length; i++) {
      for (let j = 0; j < gameboard.board[i].length; j++) {
        availableShots.push([i, j]);
      }
    }
    function shoot() {
      if (availableShots.length <= 0) return;
      return availableShots.splice(Math.floor(Math.random() * availableShots.length), 1)[0];
    }
    return {
      get gameboard() {
        return gameboard;
      },
      get name() {
        return name;
      },
      set name(newName) {
        if (!newName) throw new Error("New name isn't provided");
        else name = newName;
      },
      shoot,
    };
  }
  return {
    get gameboard() {
      return gameboard;
    },
    get name() {
      return name;
    },
    set name(newName) {
      if (!newName) throw new Error("New name isn't provided");
      else name = newName;
    },
  };
}

export default Player;