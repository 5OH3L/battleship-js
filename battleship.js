import Player from "./src/scripts/player.js";

const player = Player("Player");
const computer = Player("Computer");

// Populate player's gameboard
player.gameboard.placeShip([1, 1], 0, true);
player.gameboard.placeShip([5, 3], 1);
player.gameboard.placeShip([5, 5], 2);
player.gameboard.placeShip([7, 3], 3, true);
player.gameboard.placeShip([7, 8], 4);
console.table(player.gameboard.board);

// Populate computer's gameboard
computer.gameboard.placeShip([3, 9], 0);
computer.gameboard.placeShip([6, 7], 1);
computer.gameboard.placeShip([8, 3], 2, true);
computer.gameboard.placeShip([4, 2], 3, true);
computer.gameboard.placeShip([1, 1], 4, true);
console.table(computer.gameboard.board);

export { player, computer };