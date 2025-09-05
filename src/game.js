import { SquareObject } from "./collision-objects/square-object";
import { Board } from "./entities/board";
import { Player } from "./entities/player";
import { GameState } from "./enums/game-state";
import { GameVars, toPixelSize } from "./game-variables";
import { levels } from "./sprites/levels";
import { rectCollision } from "./utilities/collision-utilities";

export class Game {
    constructor() {
        this.lastXdiff = 0;
        this.levelIndex = 0;
        this.board = new Board(levels[this.levelIndex]);
        this.player = new Player();
        this.board.createFrontCanvas();
        this.gameOverCollisionObj = new SquareObject(0, GameVars.gameH - toPixelSize(1), GameVars.levelW, toPixelSize(4));

        this.numberOfRetrys = 3;
        this.gameState = GameState.RUNNING;

        this.timeoutID;
    }

    setLevel() {
        this.board.reset(levels[this.levelIndex]);
        this.player.reset();

        this.gameOverCollisionObj.y = GameVars.gameH - toPixelSize(1);
        this.gameOverCollisionObj.w = GameVars.levelW;

        this.draw();
        this.gameState = GameState.RUNNING;
    }

    update() {
        if (this.gameState === GameState.RUNNING) {
            if (rectCollision(this.player.collisionObj, this.gameOverCollisionObj)) {
                this.numberOfRetrys--;
                if (this.numberOfRetrys <= 0) {
                    this.gameState = GameState.GAME_OVER;
                } else {
                    this.gameState = GameState.RETRY;
                    this.timeoutID = setTimeout(() => {
                        this.setLevel();
                    }, 2000)
                }
            } else {
                this.player.update();
                this.camUpdate();
                if (rectCollision(this.player.collisionObj, this.board.gate.collisionObj)) {
                    this.levelIndex++;
                    if (this.levelIndex < levels.length) {
                        this.gameState = GameState.NEXT_LEVEL;
                        this.timeoutID = setTimeout(() => {
                            this.setLevel();
                        }, 2000)
                    } else {
                        this.gameState = GameState.GAME_COMPLETE;
                    }
                }
            }
        }
    }

    skip() {
        if (this.gameState === GameState.NEXT_LEVEL || this.gameState === GameState.RETRY) {
            clearTimeout(this.timeoutID);
            this.setLevel();
        }
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

    draw() {
        this.board.draw();
        this.player.draw();
    }
}