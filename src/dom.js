import {handleTurn, human, inputLocked, checkAllShipsPlaced} from "./state.js"
import Gameboard from "./gameboard.js";
import { shipContainer } from "./index.js";


const CELL_SIZE = 42;
let draggedShipLength = null;

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
            if(!isEnemyBoard){

                
               

                
        

                cell.addEventListener('dragover', (event) => {
                    
                     event.preventDefault();
                     if (draggedShipLength === null) return;
                       const direction = event.shiftKey ? 'horizontal' : 'vertical';
                        clearGhostCells(container);
                       showGhostCells(container, x, y, draggedShipLength, direction);
                  });
                
                  cell.addEventListener('dragleave', (event) => {
                    cell.style.backgroundColor = ''; // reset when cursor leaves this cell
                });

                cell.addEventListener('drop', (event) => {

                    
                    
                    event.preventDefault();
                    const length =  Number(event.dataTransfer.getData('shipLength'))
                    const direction = event.shiftKey ? 'horizontal' : 'vertical';
                    const success = human.gameboard.placeShip(x, y, length, direction);


                    if (success){

                        const placedShip = document.getElementById(event.dataTransfer.getData('cellId'))
                    
                        placedShip.remove()

                    

                        renderBoard(human.gameboard, document.getElementById('player-board'));
                        checkAllShipsPlaced(shipContainer);
                    }
                    

                   
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


function renderShipContainerBackground(container, rows, cols) {
    container.innerHTML = '';
    container.style.position = 'relative';
    container.style.display = 'grid';
    container.style.gridTemplateColumns = `repeat(${cols}, ${CELL_SIZE}px)`;
    container.style.gridTemplateRows = `repeat(${rows}, ${CELL_SIZE}px)`;
    for (let i = 0; i < rows * cols; i++) {
        const cell = document.createElement('div');
        cell.classList.add('water');
        container.appendChild(cell);
    }
}


function renderShipPieces(container, shipLengths) {
    const rows = 8;
    const cols = 4;
    const tempGrid = Array(cols).fill(null).map(() => Array(rows).fill(null));

    function isValidPlacement(col, row, length) {
        if (row + length - 1 > rows - 1) return false;
        for (let i = 0; i < length; i++) {
            if (tempGrid[col][row + i] !== null) return false;
        }
        return true;
    }

    shipLengths.forEach(length => {
        let placed = false;
        while (!placed) {
            const col = Math.floor(Math.random() * cols);
            const row = Math.floor(Math.random() * rows);
            if (isValidPlacement(col, row, length)) {
                for (let i = 0; i < length; i++) {
                    tempGrid[col][row + i] = length; // mark occupied
                }
                const shipDiv = document.createElement('div');
                shipDiv.classList.add('ship-piece');
                shipDiv.draggable = true;
                shipDiv.dataset.length = length;
                shipDiv.style.position = 'absolute';
                shipDiv.style.width = `${CELL_SIZE}px`;
                shipDiv.style.height = `${length * CELL_SIZE}px`;
                shipDiv.style.top = `${row * CELL_SIZE}px`;
                shipDiv.style.left = `${col * CELL_SIZE}px`;

                const cellId = crypto.randomUUID();
                shipDiv.id = cellId;


                shipDiv.addEventListener('dragstart', (event) => {
            
                    event.dataTransfer.setData('shipLength', length);
                    event.dataTransfer.setData('cellId', cellId);
                    event.target.style.opacity = '0.7';
                    draggedShipLength = length;
                    
                    
                    event.target.style.opacity = '0.7';
                });
                  
                  
                  shipDiv.addEventListener('dragend', (event) => {
                    event.target.style.opacity = '1';
                    draggedShipLength = null;
                    clearGhostCells(document.getElementById('player-board'));
                });
                  

                container.appendChild(shipDiv);
                placed = true;
            }
        }
        
    });
}

function renderShipContainer(container, shipLengths) {
    renderShipContainerBackground(container, 8, 4);
    renderShipPieces(container, shipLengths);
}


function clearGhostCells(container) {
    container.querySelectorAll('.ghost-cell').forEach(cell => {
        cell.classList.remove('ghost-cell');
    });
}

function showGhostCells(container, x, y, length, direction) {
    for (let i = 0; i < length; i++) {
        const cx = direction === 'horizontal' ? x + i : x;
        const cy = direction === 'vertical' ? y + i : y;
        const ghostCell = getCellElement(container, cx, cy);
        if (ghostCell) {
            ghostCell.classList.add('ghost-cell');
        }
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

export {renderBoard, updateCell, getCellElement, renderLogEntry, renderShipContainer};