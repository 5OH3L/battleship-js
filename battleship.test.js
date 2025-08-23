import { Ship } from "./battleship.js";

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