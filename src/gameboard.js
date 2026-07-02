import Ship from './ship.js'
import { SHIP_LENGTHS, SHIP_SKINS } from './state.js';



function Gameboard() {

    const board = Array(10).fill(null).map(() => Array(10).fill(null));
    let missedAttacks = [];
    let ships = []
    let shipPlacements = [];


    function placeShip(x, y, length, direction, skin){

        const ship = Ship(length)
        const originalX = x;
        const originalY = y;

        if (direction === "horizontal"){
            
            if (x < 0 || x + length - 1 > 9 || y < 0 || y > 9){
                console.log('ship exceeds board')
                return false;
                
            }
            for(let i = 0; i < ship.length; i++){
                if(board[x + i][y] !== null){
                    console.log('ships overlap')
                    return false;
                }
            }
        }
        if (direction === "vertical"){
            
            if (y < 0 || y + length - 1 > 9 || x < 0 || x > 9){
                console.log('ship exceeds board')
                return false;
            }
            for(let i = 0; i < ship.length; i++){
                if(board[x][y + i] !== null){
                    console.log('ships overlap')
                    return false;
                }
            }
        }

        

        if (direction === "horizontal"){
            
            for(let i = 0; i < ship.length; i++){
                board[x][y] = { ship, hit: false };
                x += 1;
            }
        }
        if (direction === "vertical"){
            
            for(let i = 0; i < ship.length; i++){
                board[x][y] = { ship, hit: false };
                y += 1;
            }
        }

        ships.push(ship);
        shipPlacements.push({ ship, x: originalX, y: originalY, length, direction, skin });
        return true;

    }

    function computerPlaceShips(gameboard) {
        SHIP_LENGTHS.forEach((length, i) => {
            let placed = false;
            while (!placed) {
                const x = Math.floor(Math.random() * 10);
                const y = Math.floor(Math.random() * 10);
                const direction = Math.random() < 0.5 ? "horizontal" : "vertical";
                placed = gameboard.placeShip(x, y, length, direction, SHIP_SKINS[i]);
            }
        });
    }

    function receiveAttack(x, y){

        const ship = board[x][y]

        if(ship !== null){
            board[x][y].hit = true
            board[x][y].ship.hit()
        }
        else if (ship === null)
        {
            missedAttacks.push({x,y})
            
        }

    }

    function getMissedAttacks(){
        return missedAttacks;
    }

    function allSunk() {
        return ships.every(ship => ship.isSunk());
    }

    function getShipPlacements(){
        return shipPlacements;
    }


    return { board, placeShip, receiveAttack, getMissedAttacks, allSunk, computerPlaceShips, getShipPlacements }
}


export default Gameboard;