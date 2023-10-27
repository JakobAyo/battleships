const Ship = require("./script");

describe("carrier", () => {
  test("Ship Size should be equal to 5", () => {
    const ship = new Ship("carrier");

    expect(ship.type).toBe("carrier");
    expect(ship.shipLength).toBe(5);
    expect(ship.maxDamage).toBe(5);
    expect(ship.sunk).toBe(false);
    expect(ship.placed).toBe(false);

    ship.incrementdamage();
    ship.incrementdamage();
    ship.incrementdamage();
    ship.incrementdamage();

    expect(ship.isSunk()).toBe(false);

    ship.incrementdamage();

    expect(ship.isSunk()).toBe(true);
  });
});

describe("destroyer", () => {
  test("Ship Size should be equla to 2", () => {
    const ship = new Ship("destroyer");

    expect(ship.type).toBe("destroyer");
    expect(ship.shipLength).toBe(2);
    expect(ship.maxDamage).toBe(2);
    expect(ship.sunk).toBe(false);
    expect(ship.placed).toBe(false);

    ship.incrementdamage();

    expect(ship.isSunk()).toBe(false);

    ship.incrementdamage();

    expect(ship.isSunk()).toBe(true);
  });
});
