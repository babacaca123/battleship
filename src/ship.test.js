import {test, expect} from '@jest/globals'
import Ship from './ship.js'


test("ship factory returns correct initial values", () => {
    const ship = Ship(6);
    expect(ship.length).toBe(6);
    expect(ship.getHits()).toBe(0);
    expect(ship.beenSunk).toBe(false);
})

test("hit increases numOfHits by 1", () => {
    const ship = Ship(6);
    ship.hit();
    expect(ship.getHits()).toBe(1);
})

test("isSunk calculates if the ship has sunk", () => {
    const ship = Ship(6);
    ship.hit();
    ship.hit();
    ship.hit();
    ship.hit();
    ship.hit();
    ship.hit();
    expect(ship.isSunk()).toBe(true);
})