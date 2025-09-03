import { Board } from "./entities/board";
import { Player } from "./entities/player";
import { Point } from "./entities/point";
import { Floor } from "./entities/tiles/floor";
import { GameVars } from "./game-variables";
import { levelOne } from "./sprites/levels";
import { createElem } from "./utilities/elem-utilities";

export class Game {
    constructor() {
        this.lastXdiff = 0;
        this.board = new Board(levelOne);
        this.player = new Player();
    }

    update() {
        this.player.update();
        this.camUpdate();
    }

    camUpdate() {
        if (this.player.collisionObj.x > GameVars.gameHW &&
            this.player.collisionObj.x < GameVars.levelW - GameVars.gameHW) {
            const newCamX = GameVars.gameHW - this.player.collisionObj.x;
            if (this.lastXdiff !== newCamX) {
                this.board.updatePos(newCamX);
                this.lastXdiff = newCamX;
            }
        }
    }
}