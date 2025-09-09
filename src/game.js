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
import { genSmallBox } from "./utilities/box-generator";
import { rectCollision } from "./utilities/collision-utilities";
import { createElem, setElemSize } from "./utilities/elem-utilities";
import { drawPixelTextInCanvas } from "./utilities/text";

export class Game {
    constructor() {
        this.camPos = new Point(0, 0);

        this.levelIndex = 0;
        this.board = new Board();

        this.board.createBackCanvas();
        this.player = new Player();
        this.board.createFrontCanvas();

        this.board.reset(levels[this.levelIndex], this.player);

        this.levelInfoCanvas = createElem(GameVars.gameDiv, "canvas");
        this.resetLevelInfo();

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

        this.board.reset(levels[this.levelIndex], this.player);

        this.lifeBar.draw(toPixelSize(13.5 + 8), toPixelSize(5.5 + 8), this.numberOfRetrys);

        this.gameOverCollisionObj.y = GameVars.levelH - toPixelSize(1);
        this.gameOverCollisionObj.w = GameVars.levelW;

        this.draw();
        this.gameState = GameState.RUNNING;

        if (GameVars.isMobile) {
            GameVars.movePad.update();
            GameVars.actionPad.update();
        }
        this.resetLevelInfo();
    }

    resetLevelInfo() {
        const levelInfoCtx = this.levelInfoCanvas.getContext("2d");
        setElemSize(this.levelInfoCanvas, toPixelSize(48), toPixelSize(12));
        this.levelInfoCanvas.style.translate = Math.round(GameVars.gameW / 2 - this.levelInfoCanvas.width / 2) + 'px ' + (toPixelSize(0)) + 'px';
        levelInfoCtx.clearRect(0, 0, this.levelInfoCanvas.width, this.levelInfoCanvas.height);
        genSmallBox(levelInfoCtx, 0, 0, Math.floor(this.levelInfoCanvas.width / toPixelSize(1)) - 1, Math.floor(this.levelInfoCanvas.height / toPixelSize(1)) - 1, toPixelSize(1), "#030f2666", "#030f2666");
        drawPixelTextInCanvas("level - " + (this.levelIndex + 1), levelInfoCtx, GameVars.pixelSize, this.levelInfoCanvas.width / toPixelSize(2), this.levelInfoCanvas.height / toPixelSize(2), "#9bf2fa", 1);
    }

    update() {
        if (this.gameState === GameState.RUNNING) {
            if (rectCollision(this.player.collisionObj, this.gameOverCollisionObj)) {
                this.takeDamage();
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

    takeDamage() {
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