import Gameboard from "./gameboard.js"


function Player(type) {

    const gameboard = Gameboard();
    
    return { type, gameboard }
}

export default Player;