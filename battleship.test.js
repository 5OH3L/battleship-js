import { Ship, Gameboard, Player } from "./battleship.js";

describe("Ship", () => {
  it("Can't create ship without providing length", () => {
    expect(() => Ship()).toThrow("Ship length must be provided");
  });

  it("Length should be an integer", () => {
    expect(() => Ship("3")).toThrow("Ship length must be an integer");
  });

  it("Length should be between 2 - 5", () => {
    expect(() => Ship(6)).toThrow("Ship length must be between 2 - 5");
  });

  it("Length should be same as given length", () => {
    expect(Ship(2).length).toBe(2);
  });

  let ship;
  beforeEach(() => {
    ship = Ship(3);
  });

  it("Initially it shouldn't be sunk", () => {
    expect(ship.sunk).toBeFalsy();
  });
  it("Initially hits should be 0", () => {
    expect(ship.hits).toBe(0);
  });
  it("Upon hitting, hit counter should incremenet by 1", () => {
    ship.hit();
    expect(ship.hits).toBe(1);
    ship.hit();
    expect(ship.hits).toBe(2);
  });
  it("Ship hit counter shouldn't increment if it has been sink", () => {
    ship.hit();
    ship.hit();
    ship.hit();
    ship.hit();
    expect(ship.hits).toBe(3);
  });
  it("Ship should sink if hit counter is greater than or equals to length", () => {
    ship.hit();
    ship.hit();
    ship.hit();
    expect(ship.sunk).toBeTruthy();
  });
});

describe("Gameboard", () => {
  let gameboard;
  beforeEach(() => {
    gameboard = Gameboard();
  });

  it("Initially every cell shouldn't be hit", () => {
    expect(gameboard.board.every(row => row.every(cell => cell === 0))).toBeTruthy();
  });

  it("Throw error for invalid coordinates", () => {
    expect(() => gameboard.receiveAttack(10, -1)).toThrow("Invalid coordinates!");
  });

  it("Throw error for non integer coordinates", () => {
    expect(() => gameboard.receiveAttack("9", 9)).toThrow("Coordinates must be integers!");
    expect(() => gameboard.receiveAttack(4, "5")).toThrow("Coordinates must be integers!");
    expect(() => gameboard.receiveAttack("-1", "10")).toThrow("Coordinates must be integers!");
  });

  it("Able to hit an empty cell", () => {
    gameboard.receiveAttack(4, 4);
    expect(gameboard.board[4][4]).toBe(-1);
  });

  it("Able to hit a ship", () => {
    // Simulate first ship in coordinates [3,3]
    gameboard.board[3][3] = 1;
    gameboard.receiveAttack(3, 3);
    expect(gameboard.board[3][3]).toBe(-2);
  });

  it("Ship hits increased after a hit", () => {
    // Simulate first ship in coordinates [2,2]
    gameboard.board[2][2] = 2;
    gameboard.receiveAttack(2, 2);
    expect(gameboard.ships[1].hits).toBe(1);
    gameboard.board[2][3] = 2;
    gameboard.receiveAttack(2, 3);
    expect(gameboard.ships[1].hits).toBe(2);
  });

  it("All missed shots are recorded", () => {
    gameboard.receiveAttack(1, 1);
    gameboard.receiveAttack(2, 2);
    gameboard.receiveAttack(3, 3);
    expect(gameboard.missedShots).toEqual([
      [1, 1],
      [2, 2],
      [3, 3],
    ]);
  });

  it("Report when all ships sunk", () => {
    gameboard.board[0][0] = 1;
    gameboard.board[0][2] = 1;
    gameboard.board[0][3] = 2;
    gameboard.board[0][4] = 2;
    gameboard.board[0][5] = 2;
    gameboard.board[0][6] = 3;
    gameboard.board[0][7] = 3;
    gameboard.board[0][8] = 3;
    gameboard.board[0][9] = 4;
    gameboard.board[1][0] = 4;
    gameboard.board[2][0] = 4;
    gameboard.board[3][0] = 4;
    gameboard.board[4][0] = 5;
    gameboard.board[5][0] = 5;
    gameboard.board[6][0] = 5;
    gameboard.board[7][0] = 5;
    gameboard.board[8][0] = 5;
    gameboard.receiveAttack(0, 0);
    gameboard.receiveAttack(0, 2);
    gameboard.receiveAttack(0, 3);
    gameboard.receiveAttack(0, 4);
    gameboard.receiveAttack(0, 5);
    gameboard.receiveAttack(0, 6);
    gameboard.receiveAttack(0, 7);
    gameboard.receiveAttack(0, 8);
    gameboard.receiveAttack(0, 9);
    gameboard.receiveAttack(1, 0);
    gameboard.receiveAttack(2, 0);
    gameboard.receiveAttack(3, 0);
    gameboard.receiveAttack(4, 0);
    gameboard.receiveAttack(5, 0);
    gameboard.receiveAttack(6, 0);
    gameboard.receiveAttack(7, 0);
    gameboard.receiveAttack(8, 0);
    expect(gameboard.allShipsSunk).toBeTruthy();
  });
});

describe("Player", () => {
  let player;
  beforeEach(() => {
    player = Player("Player-Name");
  });

  it("Has its own gameboard", () => {
    expect(player.gameboard.board).toEqual([
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
    ]);
  });

  it("Has name", () => {
    expect(player.name).toBe("Player-Name");
  });

  it("Throws error if no new name is provided when setting its name", () => {
    expect(() => {
      player.name = "";
    }).toThrow("New name isn't provided");
  });
});