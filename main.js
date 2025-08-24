import { computer, player } from "./battleship.js";
import DOM from "./src/scripts/dom.js";

DOM.renderPlayerBoard(player);
DOM.renderComputerBoard(computer);
DOM.startGame()
