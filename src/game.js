import { SquareObject } from "./collision-objects/square-object";
import { Board } from "./entities/board";
import { LifeBar } from "./entities/life-bar";
import { Player } from "./entities/player";
import { Point } from "./entities/point";
import { GameState } from "./enums/game-state";
import { GameVars, toPixelSize } from "./game-variables";
import { levels } from "./sprites/levels";
import { ActionPad } from "./ui/actionpad";
import { MovePad } from "./ui/movepad";
import { rectCollision } from "./utilities/collision-utilities";

export class Game {
    constructor() {
        this.camPos = new Point(0, 0);

        this.levelIndex = 0;
        this.board = new Board();

        this.board.createBackCanvas();
        this.player = new Player();
        this.board.createFrontCanvas();

        this.board.reset(levels[this.levelIndex]);
        this.player.reset();

        this.lifeBar = new LifeBar(GameVars.gameDiv, 1);
        this.lifeBar.draw(toPixelSize(13.5 + 8), toPixelSize(5.5 + 8), this.numberOfRetrys);

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
        this.camPos.x = 0;
        this.camPos.y = 0;

        this.board.reset(levels[this.levelIndex]);
        this.player.reset();

        this.lifeBar.draw(toPixelSize(13.5 + 8), toPixelSize(5.5 + 8), this.numberOfRetrys);

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
            if (rectCollision(this.player.collisionObj, this.gameOverCollisionObj)) {
                this.numberOfRetrys--;
                if (this.numberOfRetrys <= 0) {
                    GameVars.sound.playOverSound();
                    this.gameState = GameState.GAME_OVER;
                } else {
                    GameVars.sound.playerDeadSound();
                    this.gameState = GameState.RETRY;
                    this.timeoutID = setTimeout(() => {
                        this.setLevel();
                    }, 2000)
                }
            } else {
                this.player.update();
                this.camUpdate();
                if (rectCollision(this.player.collisionObj, this.board.gate.collisionObj)) {
                    GameVars.sound.victorySound();
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
        const newCamX = this.player.collisionObj.x > GameVars.gameHalfW && this.player.collisionObj.x < GameVars.levelW - GameVars.gameHalfW ? GameVars.gameHalfW - this.player.collisionObj.x : this.camPos.x;
        const yTarget = GameVars.gameHalfH / 2 * 3;
        const newCamY = GameVars.gameH - GameVars.levelH + (this.player.collisionObj.y < GameVars.levelH - yTarget ? GameVars.levelH - yTarget - this.player.collisionObj.y : 0);
        if (this.camPos.x !== newCamX || this.camPos.y !== newCamY) {
            this.camPos.x = newCamX;
            this.camPos.y = newCamY;
            this.board.updatePos(this.camPos);
        }
    }

    draw() {
        this.board.draw();
        this.player.draw();
    }
}