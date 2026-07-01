import Gameboard from "./gameboard.js"
import Player from "./player.js"
import { renderLogEntry, updateCell, getCellElement} from "./dom.js";
import { shipContainer } from "./index.js";



const gameboard = Gameboard();



const human = Player('player');
const computer = Player('computer');

let inputLocked = false;
let gameOver = false;
const log = [];

const winnerPopup = document.getElementById('win-lose-popup');
const winnerText = winnerPopup.children[0]

const SHIP_LENGTHS = [5, 4, 3, 3, 2];











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
    return {x , y, result}
}

function shipsPlaced(container){

    const hasShips = !!shipContainer.querySelector('.ship-piece')

    while (hasShips){
        inputLocked = true;
    }
    inputLocked = false
    shipContainer.remove();

}


function handleTurn(x, y, gameboard, cell, isEnemyBoard){

    
    

    if (gameOver) return;

    updateCell(x, y, gameboard, cell, isEnemyBoard);
    const result = (gameboard.board[x][y] !== null) ? "HIT" : "MISS";
    log.push(`Player attacked (${x},${y}) - ${result}`)
    renderLogEntry(log[log.length - 1])

    inputLocked = true;

    if(computer.gameboard.allSunk()){

        winnerPopup.style.display = 'block';
        gameOver = true;
    }

    if (gameOver) return;

    setTimeout(() => {
        const computerAttack = computerMove(human.gameboard, document.getElementById('player-board'));
        log.push(`Computer attacked (${computerAttack.x},${computerAttack.y}) - ${computerAttack.result}`)
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




export { human, computer, handleTurn, inputLocked, SHIP_LENGTHS, shipsPlaced };