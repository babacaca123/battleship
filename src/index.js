import {renderBoard} from './dom.js'
import { computer, human } from './state.js';
import './styles.css';


const playButton = document.getElementById('play-btn');
const playingScreen = document.getElementById('playing-screen')


playButton.addEventListener('click', () => {

    document.getElementById('start-screen').style.display = 'none';
    playingScreen.style.display = 'flex';
    renderBoard(human.gameboard, document.getElementById('player-board'));
    renderBoard(computer.gameboard, document.getElementById('computer-board'));
    
    
    
    


});

// does this not live in state????