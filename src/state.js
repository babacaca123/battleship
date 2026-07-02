import Gameboard from "./gameboard.js"
import Player from "./player.js"
import { renderLogEntry, updateCell, getCellElement} from "./dom.js";



const gameboard = Gameboard();



const human = Player('player');
const computer = Player('computer');

let inputLocked = true;
let gameOver = false;
const log = [];


const winnerPopup = document.getElementById('win-lose-popup');
const winnerText = winnerPopup.children[0]

const SHIP_LENGTHS = [5, 4, 3, 3, 2];

const SHIP_SKINS = ['ship-5', 'ship-4', 'submarine', 'cruiser', 'ship-2'];










function computerMove(gameboard, container){

    const board = gameboard.board;
    
    const missedAttacks = gameboard.getMissedAttacks();
    


    let x = Math.floor(Math.random() * 10);
    let y = Math.floor(Math.random() * 10);
    let value = board[x][y];

    

    while( (missedAttacks.some(attack => attack.x === x && attack.y === y)) ||
    (value !== null && value.hit)){
        
        x = Math.floor(Math.random() * 10);
        y = Math.floor(Math.random() * 10);
        value = board[x][y];
    }

    const cell = getCellElement(container, x, y);
    updateCell(x, y, gameboard, cell, false);


    const result = (gameboard.board[x][y] !== null) ? "HIT" : "MISS";
    const sunk = (result === "HIT") && gameboard.board[x][y].ship.isSunk();
    return {x , y, result, sunk}
}

function checkAllShipsPlaced(shipContainer){

    const hasShips = !!shipContainer.querySelector('.ship-piece')

    if (!hasShips) {
        shipContainer.classList.add('hidden');
        inputLocked = false;
    }

}


function handleTurn(x, y, gameboard, cell, isEnemyBoard){

    const alreadyAttacked = gameboard.board[x][y] !== null && gameboard.board[x][y].hit ||
                             gameboard.getMissedAttacks().some(a => a.x === x && a.y === y);
    if (alreadyAttacked) return;
    

    if (gameOver) return;

    updateCell(x, y, gameboard, cell, isEnemyBoard);
    const result = (gameboard.board[x][y] !== null) ? "HIT" : "MISS";
    let logLine = (`Player attacked (${x + 1},${y + 1}) - ${result}`)
    if (result === "HIT" && gameboard.board[x][y].ship.isSunk()) {
        logLine += " - SUNK!";
    }
    log.push(logLine);


    renderLogEntry(log[log.length - 1])

    inputLocked = true;

    if(computer.gameboard.allSunk()){

        winnerPopup.style.display = 'block';
        gameOver = true;
    }

    if (gameOver) return;

    setTimeout(() => {
        const computerAttack = computerMove(human.gameboard, document.getElementById('player-board'));
        const sunkText = computerAttack.sunk ? " - SUNK!" : "";
        log.push(`Computer attacked (${computerAttack.x + 1},${computerAttack.y + 1}) - ${computerAttack.result}${sunkText}`)
        renderLogEntry(log[log.length - 1])

        if(human.gameboard.allSunk()){

            winnerPopup.style.display = 'block';
            winnerText.textContent = 'You Lost lol!'
            gameOver = true;
        }
        inputLocked = false;
      }, 1500);

}





gameboard.computerPlaceShips(computer.gameboard);




export { human, computer, handleTurn, inputLocked, SHIP_LENGTHS, SHIP_SKINS, checkAllShipsPlaced };