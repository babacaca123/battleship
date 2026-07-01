import {handleTurn, inputLocked} from "./state.js"




function renderBoard(gameboard, container){

    console.log('renderboard called')

    container.innerHTML = '';
    const computerBoard = document.getElementById('computer-board');


    for (let y = 9; y >= 0; y--) {
        for (let x = 0; x < 10; x++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            container.appendChild(cell);
    
            const isEnemyBoard = (container === computerBoard);
    
            renderCellState(x, y, gameboard, cell, isEnemyBoard);
    
            if (isEnemyBoard) {
                cell.addEventListener('click', () => {
                    if (inputLocked) return;
                    
                    handleTurn(x, y, gameboard, cell, isEnemyBoard);
                    
                });
            }
        }
    }
}

function renderCellState(x, y, gameboard, cell, isEnemyBoard){
    const board = gameboard.board;
    const missedAttacks = gameboard.getMissedAttacks();
    cell.dataset.x = x;
    cell.dataset.y = y;

    const value = board[x][y];


    cell.className = "cell";

                if (value !== null && !value.hit && !isEnemyBoard) {
                    cell.classList.add('ship-cell');
                }
                else if (value !== null && value.hit) {
                    cell.classList.add('hit');
                }
                else if (value === null && missedAttacks.some(attack => attack.x === x && attack.y === y)) {
                    cell.classList.add('miss');
                }
                else{
                    cell.classList.add('water');
                }
}

function updateCell(x, y, gameboard, cell, isEnemyBoard){

    
    cell.dataset.x = x;
    cell.dataset.y = y;

    

    gameboard.receiveAttack(x, y);

    renderCellState(x,y, gameboard, cell, isEnemyBoard);
    

}


function getCellElement(container, x, y){
    
    return container.querySelector(`[data-x="${x}"][data-y="${y}"]`)
    

}


function renderLogEntry(entry) {
    const logContainer = document.getElementById('game-log');
    const entryEl = document.createElement('div'); // or 'p', or 'li' if it's a <ul>
    entryEl.textContent = entry;
    logContainer.appendChild(entryEl);
    logContainer.scrollTop = logContainer.scrollHeight;
}

export {renderBoard, updateCell, getCellElement, renderLogEntry};