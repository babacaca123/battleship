import {handleTurn, human, inputLocked, checkAllShipsPlaced, SHIP_SKINS} from "./state.js"
import { shipContainer } from "./index.js";
import Gameboard from "./gameboard.js";


const CELL_SIZE = 32;
let draggedShipLength = null;

function renderBoard(gameboard, container){

    console.log('renderboard called')

    container.innerHTML = '';
    const computerBoard = document.getElementById('computer-board');

    const isEnemyBoard = (container === computerBoard);


    for (let y = 9; y >= 0; y--) {
        for (let x = 0; x < 10; x++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            container.appendChild(cell);
    
            
    
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
                    const skin = event.dataTransfer.getData('skin');
                    const success = human.gameboard.placeShip(x, y, length, direction, skin);


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

    renderShipOverlays(gameboard, container, isEnemyBoard);
}

function renderCellState(x, y, gameboard, cell, isEnemyBoard){
    const board = gameboard.board;
    const missedAttacks = gameboard.getMissedAttacks();
    cell.dataset.x = x;
    cell.dataset.y = y;

    const value = board[x][y];


    cell.className = "cell";

                
                if (value !== null && value.hit) {
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


function renderShipOverlays(gameboard, container, isEnemyBoard){
    container.querySelectorAll('.ship-overlay').forEach(el => el.remove());

    const placements = gameboard.getShipPlacements();

    placements.forEach(placement => {
        const { ship, x, y, length, direction, skin } = placement;


        // On the enemy board, only reveal a ship once it's fully sunk
        if (isEnemyBoard && !ship.isSunk()) return;

        const shipDiv = document.createElement('div');
        shipDiv.classList.add('ship-overlay');
        shipDiv.classList.add(`skin-${skin}`);
        shipDiv.classList.add(direction === 'horizontal' ? 'ship-horizontal' : 'ship-vertical');
        shipDiv.style.setProperty('--ship-span', `${length * CELL_SIZE}px`);

        if (ship.isSunk()) shipDiv.classList.add('sunk');

        if (direction === 'horizontal') {
            shipDiv.style.left = `${x * CELL_SIZE}px`;
            shipDiv.style.top = `${(9 - y) * CELL_SIZE}px`;
            shipDiv.style.width = `${length * CELL_SIZE}px`;
            shipDiv.style.height = `${CELL_SIZE}px`;
        } else {
            shipDiv.style.left = `${x * CELL_SIZE}px`;
            shipDiv.style.top = `${(9 - (y + length - 1)) * CELL_SIZE}px`;
            shipDiv.style.width = `${CELL_SIZE}px`;
            shipDiv.style.height = `${length * CELL_SIZE}px`;
        }

        // stagger the bob animation so ships don't all rock in sync
        shipDiv.style.animationDelay = `-${(Math.random() * 3).toFixed(2)}s`;

        container.appendChild(shipDiv);
    });
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

    shipLengths.forEach((length, i) => {
        const skin = SHIP_SKINS[i];
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
                shipDiv.classList.add(`skin-${skin}`);
                shipDiv.style.position = 'absolute';
                shipDiv.style.width = `${CELL_SIZE}px`;
                shipDiv.style.height = `${length * CELL_SIZE}px`;
                shipDiv.style.top = `${row * CELL_SIZE}px`;
                shipDiv.style.left = `${col * CELL_SIZE}px`;

                const cellId = crypto.randomUUID();
                shipDiv.id = cellId;


                shipDiv.addEventListener('dragstart', (event) => {
            
                    event.dataTransfer.setData('shipLength', length);
                    event.dataTransfer.setData('skin', skin);
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
    renderBuoys(container, 8, 4);
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


let logQueue = [];
let isTypingLog = false;

function renderLogEntry(entry) {
    logQueue.push(entry);
    processLogQueue();
}


function processLogQueue(){
    if (isTypingLog || logQueue.length === 0) return;
    isTypingLog = true;

    const entry = logQueue.shift();
    const logContainer = document.getElementById('game-log');
    const entryEl = document.createElement('div');
    entryEl.classList.add('log-line', 'typing');
    logContainer.appendChild(entryEl);

    let i = 0;
    const speed = 18; // ms per character

    function typeChar(){
        if (i < entry.length) {
            entryEl.textContent += entry.charAt(i);
            i++;
            logContainer.scrollTop = logContainer.scrollHeight;
            setTimeout(typeChar, speed);
        } else {
            entryEl.classList.remove('typing');
            isTypingLog = false;
            processLogQueue();
        }
    }
    typeChar();
}

function renderBuoys(container, rows, cols) {
    // top + bottom edges: one buoy per column, centered on the column
    for (let c = 0; c < cols; c++) {
        const centerX = c * CELL_SIZE + CELL_SIZE / 2;
        container.appendChild(makeBuoy(centerX, 0));               // top edge
        container.appendChild(makeBuoy(centerX, rows * CELL_SIZE)); // bottom edge
    }
    // left + right edges: one buoy per row
    for (let r = 0; r < rows; r++) {
        const centerY = r * CELL_SIZE + CELL_SIZE / 2;
        container.appendChild(makeBuoy(0, centerY));               // left edge
        container.appendChild(makeBuoy(cols * CELL_SIZE, centerY)); // right edge
    }
}

function makeBuoy(x, y) {
    const buoy = document.createElement('div');
    buoy.classList.add('buoy');
    // position so the buoy's CENTER sits exactly on (x, y)
    buoy.style.left = `${x}px`;
    buoy.style.top = `${y}px`;
    // stagger the bob so they don't all move in sync
    buoy.style.animationDelay = `-${(Math.random() * 2.5).toFixed(2)}s`;
    return buoy;
}

export {renderBoard, updateCell, getCellElement, renderLogEntry, renderShipContainer};