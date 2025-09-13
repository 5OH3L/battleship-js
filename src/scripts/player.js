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
    const adjacentShots = [];
    function shoot() {
      if (adjacentShots.length >= 1) {
        const nextShot = adjacentShots.splice(Math.floor(Math.random() * adjacentShots.length), 1)[0];
        const availableShotsIndex = availableShots.findIndex(coordinate => {
          const x = coordinate[0];
          const y = coordinate[1];
          return nextShot[0] === x && nextShot[1] === y;
        });
        if (availableShotsIndex !== -1) return availableShots.splice(availableShotsIndex, 1)[0];
      }
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
      addAdjacentCoordinates(coordiante) {
        adjacentShots.push(coordiante);
      },
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
