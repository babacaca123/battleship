import Ship from './ship.js'



function Gameboard() {

    const board = Array(10).fill(null).map(() => Array(10).fill(null));
    let missedAttacks = [];
    let ships = []



    function placeShip(x, y, length, direction){

        const ship = Ship(length)

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


    return { board, placeShip, receiveAttack, getMissedAttacks, allSunk }
}


export default Gameboard;