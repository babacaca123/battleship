import {test, expect} from '@jest/globals'
import Gameboard from "./gameboard.js"


test("placeShip places a ship on the board", () => {
    const gameboard = Gameboard();
    gameboard.placeShip(0, 0, 3, 'horizontal');
    expect(gameboard.board[0][0]).not.toBeNull();
    expect(gameboard.board[1][0]).not.toBeNull();
    expect(gameboard.board[2][0]).not.toBeNull();
})

test("receiveAttack takes coordinates and reacts according to coordinate contents", () => {
    const gameboard = Gameboard();
    gameboard.placeShip(0, 0, 3, 'horizontal');
    gameboard.receiveAttack(0, 0);
    expect(gameboard.board[0][0].ship.getHits()).toBe(1);

})

test("receiveAttack records missed attacks", () => {
    const gameboard = Gameboard();
    gameboard.placeShip(0, 0, 3, 'horizontal');
    gameboard.receiveAttack(5, 5);
    expect(gameboard.getMissedAttacks()).toEqual([{x: 5, y: 5}]);
})

test("allSunk detects if all ships have sunk", () => {
    const gameboard = Gameboard();
    gameboard.placeShip(0, 0, 3, 'horizontal');
    gameboard.receiveAttack(0, 0);
    gameboard.receiveAttack(1, 0);
    gameboard.receiveAttack(2, 0);
    expect(gameboard.allSunk()).toBe(true);
})