import Gameboard from "./gameboard.js"
import Player from "./player.js"



const gameboard = Gameboard();



const human = Player('player');
const computer = Player('computer');

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

export { human, computer };