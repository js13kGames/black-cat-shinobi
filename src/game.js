import { SquareObject } from "./collision-objects/square-object";
import { Board } from "./entities/board";
import { LifeBar } from "./entities/life-bar";
import { Player } from "./entities/player";
import { Point } from "./entities/point";
import { GameState } from "./enums/game-state";
import { GameVars, toPixelSize } from "./game-variables";
import { missions } from "./sprites/missions";
import { ActionPad } from "./ui/actionpad";
import { MovePad } from "./ui/movepad";
import { genSmallBox } from "./utilities/box-generator";
import { rectCollision } from "./utilities/collision-utilities";
import { createElem, setElemSize } from "./utilities/elem-utilities";
import { drawPixelTextInCanvas } from "./utilities/text";

export class Game {
    constructor() {
        this.camPos = new Point(0, 0);

        this.lives = GameVars.maxLives;
        this.missionIndex = 0;
        this.board = new Board();

        this.board.createBackCanvas();
        this.player = new Player();
        this.board.createFrontCanvas();

        this.board.reset(missions[this.missionIndex], this.player);

        this.missionInfoCanvas = createElem(GameVars.gameDiv, "canvas");
        this.resetMissionInfo();

        this.lifeBarPos = new Point(toPixelSize(13.5 + 8), toPixelSize(5.5 + 8));

        this.lifeBar = new LifeBar(GameVars.gameDiv, 1);
        this.lifeBar.draw(this.lifeBarPos.x, this.lifeBarPos.y, this.lives);

        this.gameOverCollisionObj = new SquareObject(0, GameVars.levelH - toPixelSize(1), GameVars.levelW, toPixelSize(4));

        if (GameVars.isMobile) {
            GameVars.movePad = new MovePad();
            GameVars.actionPad = new ActionPad();
        }

        this.gameState = GameState.RUNNING;

        this.timeoutID;
    }

    setMission() {
        this.camPos.x = 0;
        this.camPos.y = 0;

        this.board.reset(missions[this.missionIndex], this.player);

        this.lifeBarPos.x = toPixelSize(13.5 + 8);
        this.lifeBarPos.y = toPixelSize(5.5 + 8);

        this.lifeBar.draw(this.lifeBarPos.x, this.lifeBarPos.y, this.lives);

        this.gameOverCollisionObj.y = GameVars.levelH - toPixelSize(1);
        this.gameOverCollisionObj.w = GameVars.levelW;

        this.draw();
        this.gameState = GameState.RUNNING;

        if (GameVars.isMobile) {
            GameVars.movePad.update();
            GameVars.actionPad.update();
        }
        this.resetMissionInfo();
    }

    resetMissionInfo() {
        const missionInfoCtx = this.missionInfoCanvas.getContext("2d");
        const isNewRecord = GameVars.score > GameVars.highScore;
        setElemSize(this.missionInfoCanvas, toPixelSize(isNewRecord ? 56 : 48), toPixelSize(isNewRecord ? 18 : 12));
        this.missionInfoCanvas.style.translate = Math.round(GameVars.gameW / 2 - this.missionInfoCanvas.width / 2) + 'px ' + (toPixelSize(8)) + 'px';
        missionInfoCtx.clearRect(0, 0, this.missionInfoCanvas.width, this.missionInfoCanvas.height);
        genSmallBox(missionInfoCtx, 0, 0, Math.floor(this.missionInfoCanvas.width / toPixelSize(1)) - 1, Math.floor(this.missionInfoCanvas.height / toPixelSize(1)) - 1, toPixelSize(1), "#030f2666", "#030f2666");
        if (isNewRecord) {
            drawPixelTextInCanvas("new record!", missionInfoCtx, GameVars.pixelSize, this.missionInfoCanvas.width / toPixelSize(2), 5, "#9bf2fa", 1);
            drawPixelTextInCanvas("mission - " + (this.missionIndex + 1), missionInfoCtx, GameVars.pixelSize, this.missionInfoCanvas.width / toPixelSize(2), 13, "#9bf2fa", 1);
        } else {
            drawPixelTextInCanvas("mission - " + (this.missionIndex + 1), missionInfoCtx, GameVars.pixelSize, this.missionInfoCanvas.width / toPixelSize(2), this.missionInfoCanvas.height / toPixelSize(2), "#9bf2fa", 1);
        }
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
                    this.missionIndex++;
                    if (this.missionIndex < missions.length) {
                        this.gameState = GameState.NEXT_MISSION;
                        this.timeoutID = setTimeout(() => {
                            this.setMission();
                        }, 2000)
                    } else {
                        this.gameState = GameState.GAME_COMPLETE;
                    }
                }
            }
        }
    }

    takeDamage() {
        this.lives--;
        if (this.lives <= 0) {
            GameVars.sound.playOverSound();
            this.gameState = GameState.GAME_OVER;
        } else {
            GameVars.sound.playerDeadSound();
            this.gameState = GameState.RETRY;
            this.timeoutID = setTimeout(() => {
                this.setMission();
            }, 2000)
        }
    }

    gainLife(x, y) {
        if (this.lives < GameVars.maxLives) {
            GameVars.sound.victorySound();

            this.lives++;
            this.lifeBar.draw(this.lifeBarPos.x, this.lifeBarPos.y, this.lives);

            const rect = this.board.boardArray[y][x].collisionObj;
            const boardCanvasCtx = this.board.boardCanvas.getContext("2d");
            boardCanvasCtx.clearRect(rect.x, rect.y, rect.w, rect.h);

            this.board.boardArray[y][x] = null;
        }
    }

    skip() {
        if (this.gameState === GameState.NEXT_MISSION || this.gameState === GameState.RETRY) {
            clearTimeout(this.timeoutID);
            this.setMission();
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