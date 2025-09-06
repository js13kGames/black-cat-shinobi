import { SquareObject } from "./collision-objects/square-object";
import { Board } from "./entities/board";
import { Player } from "./entities/player";
import { GameState } from "./enums/game-state";
import { GameVars, toPixelSize } from "./game-variables";
import { levels } from "./sprites/levels";
import { ActionPad } from "./ui/actionpad";
import { MovePad } from "./ui/movepad";
import { rectCollision } from "./utilities/collision-utilities";

export class Game {
    constructor() {
        this.lastXdiff = 0;
        this.lastYdiff = 0;

        this.levelIndex = 0;
        this.board = new Board();

        this.board.createBackCanvas();
        this.player = new Player();
        this.board.createFrontCanvas();

        this.board.reset(levels[this.levelIndex]);
        this.player.reset();

        this.gameOverCollisionObj = new SquareObject(0, GameVars.levelH - toPixelSize(1), GameVars.levelW, toPixelSize(4));

        if (GameVars.isMobile) {
            GameVars.movePad = new MovePad();
            GameVars.actionPad = new ActionPad();
        }

        this.numberOfRetrys = 3;
        this.gameState = GameState.RUNNING;

        this.timeoutID;
    }

    setLevel() {
        this.board.reset(levels[this.levelIndex]);
        this.player.reset();

        this.gameOverCollisionObj.y = GameVars.levelH - toPixelSize(1);
        this.gameOverCollisionObj.w = GameVars.levelW;

        this.draw();
        this.gameState = GameState.RUNNING;

        if (GameVars.isMobile) {
            GameVars.movePad.update();
            GameVars.actionPad.update();
        }
    }

    update() {
        if (this.gameState === GameState.RUNNING) {
            // if (rectCollision(this.player.collisionObj, this.gameOverCollisionObj)) {
            //     this.numberOfRetrys--;
            //     if (this.numberOfRetrys <= 0) {
            //         this.gameState = GameState.GAME_OVER;
            //     } else {
            //         this.gameState = GameState.RETRY;
            //         this.timeoutID = setTimeout(() => {
            //             this.setLevel();
            //         }, 2000)
            //     }
            // } else {
            this.player.update();
            this.camUpdate();
            //     if (rectCollision(this.player.collisionObj, this.board.gate.collisionObj)) {
            //         this.levelIndex++;
            //         if (this.levelIndex < levels.length) {
            //             this.gameState = GameState.NEXT_LEVEL;
            //             this.timeoutID = setTimeout(() => {
            //                 this.setLevel();
            //             }, 2000)
            //         } else {
            //             this.gameState = GameState.GAME_COMPLETE;
            //         }
            //     }
            // }
        }
    }

    skip() {
        if (this.gameState === GameState.NEXT_LEVEL || this.gameState === GameState.RETRY) {
            clearTimeout(this.timeoutID);
            this.setLevel();
        }
    }

    camUpdate() {
        const newCamX = this.player.collisionObj.x > GameVars.gameHalfW && this.player.collisionObj.x < GameVars.levelW - GameVars.gameHalfW ? GameVars.gameHalfW - this.player.collisionObj.x : this.lastXdiff;
        const newCamY = GameVars.gameH - GameVars.levelH + toPixelSize(16);
        if (this.lastXdiff !== newCamX || this.lastYdiff !== newCamY) {
            this.board.updatePos(newCamX, newCamY);
            this.lastXdiff = newCamX;
            this.lastYdiff = newCamY;
        }
    }

    draw() {
        this.board.draw();
        this.player.draw();
    }
}