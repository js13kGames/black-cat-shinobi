import { Player } from "./entities/player";
import { Floor } from "./entities/tiles/floor";
import { GameVars } from "./game-variables";
import { createElem } from "./utilities/elem-utilities";

export class Game{
    constructor(){
        this.gameCanvas = createElem(GameVars.gameDiv, "canvas", null, null, GameVars.gameW, GameVars.gameH, GameVars.isMobile, "#a8a8a8");
        this.gameCanvasCtx =  this.gameCanvas.getContext("2d");
        this.board = this.initBoardArray();
        console.log(this.board);
        this.player = new Player();
    }

     initBoardArray() {
        let newBoard = [];
        for (let y = 0; y < GameVars.roomHeight; y++) {
            newBoard.push([]);
            for (let x = 0; x < GameVars.roomWidth; x++) {
                newBoard[y].push(y == Math.round(GameVars.roomHeight) - 1 ? new Floor(x, y) : null);
                // newBoard[y].push(new Floor(x, y) );
            }
        }
        return newBoard;
    }


    update(){
        this.player.update();
    }

    draw(){
        this.gameCanvasCtx.clearRect(0, 0, this.gameCanvas.width, this.gameCanvas.height);
        this.board.forEach( row => row.forEach(block => block?.draw(this.gameCanvasCtx)));
        this.player.draw(this.gameCanvasCtx);
    }
}