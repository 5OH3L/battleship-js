function Ship(len) {
  if (!len) throw new Error("Ship length must be provided!");
  if (!Number.isInteger(len)) throw new Error("Ship length must be an integer");
  if (len < 2 || len > 5) throw new Error("Ship length must be between 2 - 5");
  const length = len;
  let hits = 0;
  let sunk = false;
  return {
    get length() {
      return length;
    },
    get hits() {
      return hits;
    },
    hit() {
      if (sunk) return hits;
      if (++hits >= length) sunk = true;
      return hits;
    },
    get sunk() {
      return sunk;
    },
  };
}

function Gameboard() {
  // 0 = haven't hit
  // 1,2,3,4,5 = ship's index that is on the grid
  // -1 = shot an empty cell
  // -2 = shot a ship
  const ships = [Ship(2), Ship(3), Ship(3), Ship(4), Ship(5)];
  const board = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ];
  const missedShots = [];
  function areAllShipsSunk() {
    return ships.every(ship => ship.sunk === true);
  }
  function receiveAttack(x, y) {
    if (!Number.isInteger(x) || !Number.isInteger(y)) throw new Error("Coordinates must be integers!");
    if (x > 9 || x < 0 || y > 9 || y < 0) throw new Error("Invalid coordinates!");
    if (board[x][y] === 0) {
      board[x][y] = -1;
      missedShots.push([x, y]);
    } else {
      switch (board[x][y]) {
        case 1:
          ships[0].hit();
          break;
        case 2:
          ships[1].hit();
          break;
        case 3:
          ships[2].hit();
          break;
        case 4:
          ships[3].hit();
          break;
        case 5:
          ships[4].hit();
          break;
      }
      board[x][y] = -2;
    }
    if (areAllShipsSunk()) {
      console.info("All ships sunk");
    }
  }
  return {
    get board() {
      return board;
    },
    get ships() {
      return ships;
    },
    receiveAttack,
    get missedShots() {
      return missedShots;
    },
    get allShipsSunk() {
      return areAllShipsSunk();
    },
  };
}

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

export { Ship, Gameboard, Player };