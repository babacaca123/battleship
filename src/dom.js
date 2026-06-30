import {human, computer} from './state.js'




function renderBoard(gameboard, container){


    container.innerHTML = '';
    const computerBoard = document.getElementById('computer-board');


    for (let y = 9; y >= 0; y--) {
        for (let x = 0; x < 10; x++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');

            cell.dataset.x = x;
            cell.dataset.y = y;
            
            container.appendChild(cell);

            if (container === computerBoard){
                cell.addEventListener('click', () => {

                    updateCell(x, y, gameboard, cell);
                })
            }
            
            
            

        }
    }

}



function updateCell(x, y, gameboard, cell){

    const board = gameboard.board;
    const missedAttacks = gameboard.getMissedAttacks();
    cell.dataset.x = x;
    cell.dataset.y = y;



    gameboard.receiveAttack(x, y);

    const value = board[x][y];


                if (value !== null && !value.hit) {
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


    
    console.log(missedAttacks);

}

export default renderBoard;