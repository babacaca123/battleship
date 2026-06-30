import Gameboard from "./gameboard.js"
import Player from "./player.js"
import { renderBoard, updateCell, getCellElement} from "./dom.js";



const gameboard = Gameboard();



const human = Player('player');
const computer = Player('computer');

let inputLocked = false;

const winnerPopup = document.getElementById('win-lose-popup');
const winnerText = winnerPopup.children[0]


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
}




function handleTurn(x, y, gameboard, cell, isEnemyBoard){

    updateCell(x, y, gameboard, cell, isEnemyBoard);

    inputLocked = true;

    if(computer.gameboard.allSunk()){

        winnerPopup.style.display = 'block';
    }

    setTimeout(() => {
        computerMove(human.gameboard, !isEnemyBoard);

        if(human.gameboard.allSunk()){

            winnerPopup.style.display = 'block';
            winnerText.textContent = 'You Lost lol!'
        }
        inputLocked = false;
      }, 2000);

   

    

    





}






human.gameboard.placeShip(2, 7, 3, "vertical");

computer.gameboard.placeShip(3, 2, 2, "horizontal");

human.gameboard.placeShip(1, 1, 5, "horizontal");

computer.gameboard.placeShip(6, 5, 2, "horizontal");

computer.gameboard.receiveAttack(1, 1);
computer.gameboard.receiveAttack(1, 2);
computer.gameboard.receiveAttack(6, 5);
computer.gameboard.receiveAttack(3, 2);
human.gameboard.receiveAttack(1, 1);
human.gameboard.receiveAttack(1, 2);

export { human, computer, handleTurn };