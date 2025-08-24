import Ship from "./ship.js";

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
  function placeShip(coordinates, shipIndex, isHorizontal = false) {
    const [x, y] = coordinates;
    if (isHorizontal) {
      const horizontalPlacementCells = [];
      for (let i = 0; i < ships[shipIndex].length; i++) horizontalPlacementCells.push([x, y + i]);
      if (board.some(row => row.some(cell => cell === shipIndex + 1)))
        throw new Error("The ship has been placed already!");
      else if (
        horizontalPlacementCells.some(cell => [1, 2, 3, 4, 5].some(shipIndex => board[cell[0]][cell[1]] === shipIndex))
      )
        throw new Error("Occupied cells");
      else {
        horizontalPlacementCells.forEach(cell => {
          board[cell[0]][cell[1]] = shipIndex + 1;
        });
      }
    } else {
      const verticalPlacementCells = [];
      for (let i = 0; i < ships[shipIndex].length; i++) verticalPlacementCells.push([x - i, y]);
      if (board.some(row => row.some(cell => cell === shipIndex + 1)))
        throw new Error("The ship has been placed already!");
      else if (
        verticalPlacementCells.some(cell => [1, 2, 3, 4, 5].some(shipIndex => board[cell[0]][cell[1]] === shipIndex))
      )
        throw new Error("Occupied cells");
      else {
        verticalPlacementCells.forEach(cell => {
          board[cell[0]][cell[1]] = shipIndex + 1;
        });
      }
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
    placeShip,
  };
}

export default Gameboard;