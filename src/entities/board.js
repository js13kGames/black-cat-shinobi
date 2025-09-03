import { GameVars, toPixelSize } from "../game-variables";
import { leaf } from "../sprites/environment";
import { generateBox, generateSphere } from "../utilities/box-generator";
import { drawSprite } from "../utilities/draw-utilities";
import { createElem } from "../utilities/elem-utilities";
import { randomNumb, randomNumbOnRange } from "../utilities/general-utilities";
import { Floor } from "./tiles/floor";
import { HouseCeiling } from "./tiles/house-ceiling";

export class Board {
    constructor(levelData) {
        GameVars.levelW = levelData[0].length * toPixelSize(16);
        this.moonCanvas = createElem(GameVars.gameDiv, "canvas", null, null, GameVars.gameW, GameVars.gameH);
        this.cloudCanvas = createElem(GameVars.gameDiv, "canvas", null, null, GameVars.levelW / 3 * 2, GameVars.gameH / 6 * 4);
        this.bambooCanvas = createElem(GameVars.gameDiv, "canvas", null, null, GameVars.levelW / 6 * 5, GameVars.gameH);
        this.boardCanvas = createElem(GameVars.gameDiv, "canvas", null, null, GameVars.levelW, GameVars.gameH);
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
        this.bambooCanvas.style.translate = (camX * (this.bambooCanvas.width - GameVars.gameW) / (GameVars.levelW - GameVars.gameW)) + 'px ' + (0) + 'px';
        this.cloudCanvas.style.translate = (camX * (this.cloudCanvas.width - GameVars.gameW) / (GameVars.levelW - GameVars.gameW)) + 'px ' + (0) + 'px';
    }

    draw() {
        this.drawMoonCanvas();
        this.drawCloudCanvas();
        this.drawBambooCanvas();
        this.drawBoardCanvas();
    }

    drawMoonCanvas() {
        const moonCanvasCtx = this.moonCanvas.getContext("2d");
        moonCanvasCtx.fillStyle = "#030f26";
        moonCanvasCtx.fillRect(0, 0, this.moonCanvas.width, this.moonCanvas.width);
        const moonRadius = this.moonCanvas.height / 2 / toPixelSize(1);
        const moonX = this.moonCanvas.width / 2 / toPixelSize(2) - moonRadius + 20;
        generateSphere(moonCanvasCtx, moonX, 5, moonRadius, toPixelSize(1), "#9bf2fa");
        generateSphere(moonCanvasCtx, moonX - 20, 8, moonRadius - 3, toPixelSize(1), "#030f26");
        generateBox(moonCanvasCtx, 0, 0, this.moonCanvas.width / toPixelSize(1), this.moonCanvas.height / toPixelSize(1), toPixelSize(1), "#9bf2fa", () => randomNumb(1000) < 1);
    }

    drawCloudCanvas() {
        const cloudCtx = this.cloudCanvas.getContext("2d");
        const adjustement = 24;
        for (let y = 0; y < this.cloudCanvas.height / toPixelSize(2); y++) {
            for (let x = -adjustement; x < adjustement + (this.cloudCanvas.width / toPixelSize(1)); x++) {
                if (randomNumb(1000) < 1) {
                    this.createCloud(cloudCtx, x, y, toPixelSize(2));
                }
            }
        }
    }

    createCloud(ctx, x, y, pixelSize) {
        ctx.fillStyle = "#edeef7";
        ctx.fillRect(Math.round(((x + 8) * pixelSize)), Math.round(((y - 2) * pixelSize)), pixelSize * 16, pixelSize);
        ctx.fillRect(Math.round(((x + 4) * pixelSize)), Math.round(((y - 1) * pixelSize)), pixelSize * 24, pixelSize);
        ctx.fillRect(Math.round((x * pixelSize)), Math.round((y * pixelSize)), pixelSize * 32, pixelSize);
    }

    drawBambooCanvas() {
        const bambooCanvasCtx = this.bambooCanvas.getContext("2d");
        bambooCanvasCtx.fillStyle = "#3d665f";
        bambooCanvasCtx.fillRect(0, this.bambooCanvas.height - toPixelSize(46), this.bambooCanvas.width, toPixelSize(16));
        const adjustement = 24;
        for (let x = -adjustement; x < adjustement + (this.bambooCanvas.width / toPixelSize(1)); x++) {
            if (randomNumb(10) < 1) {
                this.createBamboo(bambooCanvasCtx, Math.round(x * toPixelSize(2)));
            }
        }
    }

    createBamboo(ctx, x) {
        const randomY = toPixelSize(randomNumb(3));
        const endY = this.bambooCanvas.height - toPixelSize(45) + randomY;
        const bambooHeight = toPixelSize(randomNumbOnRange(48, 96));

        ctx.fillStyle = "#2c484a";
        ctx.fillRect(x, Math.round(endY - bambooHeight), toPixelSize(4), bambooHeight);

        ctx.fillStyle = "#3d665f";
        ctx.fillRect(x, Math.round(endY - bambooHeight), toPixelSize(1), bambooHeight - toPixelSize(1) - randomY);

        for (let i = 0; i < Math.floor(bambooHeight / toPixelSize(16)); i++) {
            const y = Math.round(endY - bambooHeight + (i * toPixelSize(16)));
            ctx.fillStyle = "#4c8062";
            ctx.fillRect(x, y, toPixelSize(4), toPixelSize(1));
            if (randomNumb(10) < 7) {
                const invert = randomNumb(10) < 5;
                drawSprite(ctx, leaf, toPixelSize(1), (x / toPixelSize(1)) + (invert ? -5 : 4), (y / toPixelSize(1)) - 3, null, invert);
            }
        }
    }

    drawBoardCanvas() {
        const boardCanvasCtx = this.boardCanvas.getContext("2d");
        boardCanvasCtx.fillStyle = "#3d665f";
        boardCanvasCtx.fillRect(0, this.boardCanvas.height - toPixelSize(16), this.boardCanvas.width, toPixelSize(16));
        this.boardArray.forEach(row => row.forEach(block => block?.draw(boardCanvasCtx)));
    }
}