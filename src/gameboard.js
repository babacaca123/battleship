import Ship from './ship.js'
import { SHIP_LENGTHS } from './state.js';



function Gameboard() {

    const board = Array(10).fill(null).map(() => Array(10).fill(null));
    let missedAttacks = [];
    let ships = []



    function placeShip(x, y, length, direction){

        const ship = Ship(length)

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
        return true;

    }

    function computerPlaceShips(gameboard) {
        SHIP_LENGTHS.forEach(length => {
            let placed = false;
            while (!placed) {
                const x = Math.floor(Math.random() * 10);
                const y = Math.floor(Math.random() * 10);
                const direction = Math.random() < 0.5 ? "horizontal" : "vertical";
                placed = gameboard.placeShip(x, y, length, direction);
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


    return { board, placeShip, receiveAttack, getMissedAttacks, allSunk, computerPlaceShips }
}


export default Gameboard;