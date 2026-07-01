import {renderBoard, renderShipContainer} from './dom.js'
import { computer, human, SHIP_LENGTHS } from './state.js';
import './styles.css';


const playButton = document.getElementById('play-btn');
const playingScreen = document.getElementById('playing-screen')
export const shipContainer = document.getElementById('ship-container')



playButton.addEventListener('click', () => {

    document.getElementById('start-screen').style.display = 'none';
    playingScreen.style.display = 'flex';
    renderBoard(human.gameboard, document.getElementById('player-board'));
    renderBoard(computer.gameboard, document.getElementById('computer-board'));
    renderShipContainer(shipContainer, SHIP_LENGTHS);
    // shipsPlaced(shipContainer);
    
    
    
    


});



// does this not live in state????