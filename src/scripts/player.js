import Gameboard from "./gameboard.js";

function Player(playerName) {
  let name = playerName || null;
  const gameboard = Gameboard();
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