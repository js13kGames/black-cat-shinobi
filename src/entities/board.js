import { GameVars, toPixelSize } from "../game-variables";
import { levelOne } from "../sprites/levels";
import { clamp } from "../utilities/collision-utilities";
import { createElem } from "../utilities/elem-utilities";
import { Point } from "./point";
import { Floor } from "./tiles/floor";
import { HouseCeiling } from "./tiles/house-ceiling";

export class Board {
    constructor(levelData) {
        GameVars.levelW = levelData[0].length * toPixelSize(16);
        this.boardCanvas = createElem(GameVars.gameDiv, "canvas", null, null, GameVars.levelW, levelData.length * toPixelSize(32));
        this.boardCanvasCtx = this.boardCanvas.getContext("2d");
        this.boardArray = this.initBoardArray(levelData);
        this.draw();
    }

    initBoardArray(levelData) {
        let newBoard = [];
        for (let y = 0; y < levelData.length * 2; y++) {
            newBoard.push([]);
            for (let x = 0; x < levelData[0].length; x++) {
                if (y % 2 === 0) {
                    newBoard[y].push(this.retrieveBlockType(levelData[y / 2][x], x, y));
                } else {
                    newBoard[y].push(y == Math.round(GameVars.roomHeight) - 1 ? new Floor(x, y) : null);
                }
            }
        }
        return newBoard;
    }

    retrieveBlockType(levelDataType, x, y) {
        switch (levelDataType) {
            case 1:
                return new Floor(x, y);
            case 2:
                return new HouseCeiling(x, y);
            default:
                return null;
        }
    }

    updatePos(camX) {
        this.boardCanvas.style.translate = (camX) + 'px ' + (0) + 'px';
    }

    lerp(a, b, t) {
        return a + (b - a) * t;
    }


    draw() {
        this.boardCanvasCtx.clearRect(0, 0, this.boardCanvas.width, this.boardCanvas.height);
        this.boardArray.forEach(row => row.forEach(block => block?.draw(this.boardCanvasCtx)));
    }
}