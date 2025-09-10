import { TileType } from "../enums/tile-type";
import { GameVars, toPixelSize } from "../game-variables";
import { bambooBackColors, bambooFrontColors, leaf } from "../sprites/environment";
import { generateBox, generateSphere } from "../utilities/box-generator";
import { clamp } from "../utilities/collision-utilities";
import { drawSprite } from "../utilities/draw-utilities";
import { createElem, setElemSize } from "../utilities/elem-utilities";
import { randomNumb, randomNumbOnRange } from "../utilities/general-utilities";
import { Floor } from "./tiles/floor";
import { Gate } from "./tiles/gate";
import { Heart } from "./tiles/heart";
import { Hole } from "./tiles/hole";
import { HouseBottom } from "./tiles/house-bottom";
import { HouseCeiling } from "./tiles/house-ceiling";
import { Spikes } from "./tiles/spikes";
import { Stone } from "./tiles/stone";

export class Board {
    constructor() {
        this.boardH;
        this.boardW;

        this.boardArray;

        this.gate;
    }

    createBackCanvas() {
        this.moonCanvas = createElem(GameVars.gameDiv, "canvas");
        this.cloudCanvas = createElem(GameVars.gameDiv, "canvas");
        this.bambooCanvas = createElem(GameVars.gameDiv, "canvas");
        this.boardCanvas = createElem(GameVars.gameDiv, "canvas");
    }

    createFrontCanvas() {
        this.bambooFrontCanvas = createElem(GameVars.gameDiv, "canvas");
    }

    reset(missionData, player) {
        this.boardW = Math.ceil(clamp(missionData[0].length, GameVars.roomWidth, 256));
        this.boardH = Math.ceil(clamp(GameVars.roomHeight + 3, (missionData.length * 2) + 3, 64));

        GameVars.levelW = this.boardW * toPixelSize(16);
        GameVars.levelH = this.boardH * toPixelSize(16);

        const xDiff = GameVars.levelW - GameVars.gameW;
        const yDiff = GameVars.levelH - GameVars.gameH;

        setElemSize(this.moonCanvas, GameVars.gameW, GameVars.gameH);
        setElemSize(this.cloudCanvas, GameVars.gameW + xDiff / 3 * 2, GameVars.gameH + yDiff / 3 * 2);
        setElemSize(this.bambooCanvas, GameVars.gameW + xDiff / 6 * 5, GameVars.gameH + yDiff / 6 * 5);
        setElemSize(this.boardCanvas, GameVars.levelW, GameVars.levelH);
        setElemSize(this.bambooFrontCanvas, GameVars.gameW + xDiff / 3 * 4, GameVars.gameH + yDiff / 3 * 4);

        this.boardCanvas.style.translate = "";
        this.bambooCanvas.style.translate = "";
        this.cloudCanvas.style.translate = "";
        this.bambooFrontCanvas.style.translate = "";

        this.boardArray = this.initBoardArray(missionData, player);
    }

    initBoardArray(missionData, player) {
        let newBoard = [];
        const missionDataH = missionData.length * 2;
        const levelYstart = this.boardH - missionDataH - 1;
        let yIndex = 0;

        const missionDataW = missionData[0].length;
        const levelXstart = (this.boardW - missionDataW) / 2;
        let xIndex = 0;

        for (let y = 0; y < this.boardH; y++) {
            newBoard.push([]);
            for (let x = 0; x < this.boardW; x++) {
                if (y >= levelYstart) {
                    let missionDataIndex = Math.floor(yIndex === 0 ? 0 : yIndex / 2);
                    missionDataIndex = missionDataIndex < missionData.length - 1 ? missionDataIndex : missionData.length - 1;
                    if (yIndex % 2 === 0) {
                        if (missionDataIndex > 0 && missionData[missionDataIndex][xIndex] === TileType.FLOOR && missionData[missionDataIndex - 1][xIndex] === TileType.FLOOR) {
                            newBoard[y].push(new Floor(x, y, true));
                        } else {
                            newBoard[y].push(this.retrieveGameBlock(missionData[missionDataIndex][xIndex], x, y, player));
                        }
                    } else {
                        if (missionData[missionDataIndex][xIndex] === TileType.SPIKES) {
                            if (y >= this.boardH - 2) {
                                if (y === this.boardH - 2) newBoard[y - 1][x] = new Hole(x, y - 1);
                                newBoard[y].push(new Spikes(x, y));
                            } else if (missionDataIndex + 1 < missionData.length && missionData[missionDataIndex + 1][xIndex] !== TileType.EMPTY && missionData[missionDataIndex + 1][xIndex] !== TileType.SPIKES) {
                                newBoard[y].push(new Spikes(x, y));
                            } else if (missionDataIndex - 1 >= 0 && missionData[missionDataIndex - 1][xIndex] !== TileType.EMPTY && missionData[missionDataIndex - 1][xIndex] !== TileType.SPIKES) {
                                newBoard[y].push(new Spikes(x, y - 1, true));
                            } else if (xIndex - 1 >= 0 && missionData[missionDataIndex][xIndex - 1] !== TileType.EMPTY) {
                                newBoard[y].push(new Spikes(x, y, true, true));
                            } else if (xIndex + 1 < missionData[0].length - 1 && missionData[missionDataIndex][xIndex + 1] !== TileType.EMPTY) {
                                newBoard[y].push(new Spikes(x, y, false, true));
                            } else {
                                newBoard[y].push(new Spikes(x, y));
                            }
                        } else if (missionData[missionDataIndex][xIndex] === TileType.HOUSE_CEILING) {
                            newBoard[y].push(new HouseBottom(x, y, missionDataIndex + 1 === missionData.length - 1 || (missionData[missionDataIndex + 1][xIndex] === TileType.FLOOR || missionData[missionDataIndex + 1][xIndex] === TileType.STONE)));
                        } else if ((missionData[missionDataIndex][xIndex] === TileType.STONE || missionData[missionDataIndex][xIndex] === TileType.FLOOR) && missionDataIndex !== missionData.length - 1) {
                            newBoard[y].push(this.retrieveGameBlock(missionData[missionDataIndex][xIndex], x, y));
                        } else {
                            newBoard[y].push(null);
                        }
                    }
                    if (x >= levelXstart) {
                        xIndex++;
                        xIndex = xIndex < missionDataW - 1 ? xIndex : missionDataW - 1;
                    }
                } else {
                    newBoard[y].push(null);
                }
            }
            xIndex = 0;
            if (y >= levelYstart) {
                yIndex++;
                yIndex = yIndex < missionDataH - 1 ? yIndex : missionDataH - 1;
            }
        }
        return newBoard;
    }

    isFloor(tileType) {
        return tileType === TileType.FLOOR || tileType === TileType.HOLE;
    }

    retrieveGameBlock(tileType, x, y, player) {
        switch (tileType) {
            case TileType.FLOOR:
                return new Floor(x, y, y < this.boardH - 3);
            case TileType.HOUSE_CEILING:
                return new HouseCeiling(x, y);
            case TileType.HOLE:
                return new Hole(x, y);
            case TileType.STONE:
                return new Stone(x, y);
            case TileType.HEART:
                return new Heart(x, y);
            case TileType.PLAYER:
                player.reset(x, y);
                return null;
            case TileType.GATE:
                this.gate = new Gate(x, y);
                return this.gate;
            default:
                return null;
        }
    }

    updatePos(camPos) {
        this.UpdateCanvasPos(this.cloudCanvas, camPos);
        this.UpdateCanvasPos(this.bambooCanvas, camPos);
        this.boardCanvas.style.translate = (camPos.x) + 'px ' + (camPos.y) + 'px';
        this.UpdateCanvasPos(this.bambooFrontCanvas, camPos);
    }

    UpdateCanvasPos(canvas, camPos) {
        canvas.style.translate = this.threeStepTest(camPos.x, canvas.width - GameVars.gameW, GameVars.levelW - GameVars.gameW) + 'px ' +
            this.threeStepTest(camPos.y, canvas.height - GameVars.gameH, GameVars.levelH - GameVars.gameH) + 'px';
    }

    threeStepTest(value3, value2, value1) {
        const result = value3 * value2 / value1;
        return result || 0;
    }

    draw() {
        this.drawMoonCanvas();
        this.drawCloudCanvas();
        this.drawBambooCanvas();
        this.drawBoardCanvas();
        this.drawBambooFrontCanvas();
    }

    drawMoonCanvas() {
        const moonCanvasCtx = this.moonCanvas.getContext("2d");
        moonCanvasCtx.clearRect(0, 0, this.moonCanvas.width, this.moonCanvas.height);

        moonCanvasCtx.fillStyle = "#030f26";
        moonCanvasCtx.fillRect(0, 0, this.moonCanvas.width, this.moonCanvas.height);
        const moonRadius = Math.round(this.moonCanvas.height / 2 / toPixelSize(1));
        const moonWidth = Math.round(moonRadius / 5);
        const moonX = Math.round(this.moonCanvas.width / 2 / toPixelSize(2) - moonRadius + moonWidth);
        generateSphere(moonCanvasCtx, moonX, 5, moonRadius, toPixelSize(1), "#9bf2fa");
        generateSphere(moonCanvasCtx, moonX - moonWidth, 8, moonRadius - 3, toPixelSize(1), "#030f26");
        generateBox(moonCanvasCtx, 0, 0, this.moonCanvas.width / toPixelSize(1), this.moonCanvas.height / toPixelSize(1), toPixelSize(1), "#9bf2fa", () => randomNumb(1000) < 1);
    }

    drawCloudCanvas() {
        const cloudCtx = this.cloudCanvas.getContext("2d");
        cloudCtx.clearRect(0, 0, this.cloudCanvas.width, this.cloudCanvas.height);

        const adjustement = 24;
        for (let y = 0; y < this.cloudCanvas.height / toPixelSize(2) - 56; y++) {
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
        bambooCanvasCtx.clearRect(0, 0, this.bambooCanvas.width, this.bambooCanvas.height);

        const floorY = this.bambooCanvas.height - toPixelSize(48);
        bambooCanvasCtx.fillStyle = "#3d665f";
        bambooCanvasCtx.fillRect(0, floorY - toPixelSize(14), this.bambooCanvas.width, this.bambooCanvas.height);
        bambooCanvasCtx.fillStyle = "#4c7972";
        bambooCanvasCtx.fillRect(0, floorY - toPixelSize(14), this.bambooCanvas.width, toPixelSize(1));
        const adjustement = 24;
        for (let x = -adjustement; x < adjustement + (this.bambooCanvas.width / toPixelSize(1)); x++) {
            if (randomNumb(10) < 1) {
                this.createBamboo(bambooCanvasCtx, Math.round(x * toPixelSize(2)), floorY - toPixelSize(13), 1, bambooBackColors);
            }
        }
    }

    drawBoardCanvas() {
        const boardCanvasCtx = this.boardCanvas.getContext("2d");
        boardCanvasCtx.clearRect(0, 0, this.boardCanvas.width, this.boardCanvas.height);

        boardCanvasCtx.fillStyle = "#3d665f";
        boardCanvasCtx.fillRect(0, this.boardCanvas.height - toPixelSize(16 * 3), this.boardCanvas.width, toPixelSize(16 * 3));
        this.boardArray.forEach(row => row.forEach(block => block?.draw(boardCanvasCtx)));
    }

    drawBambooFrontCanvas() {
        const bambooFrontCanvasCtx = this.bambooFrontCanvas.getContext("2d");
        bambooFrontCanvasCtx.clearRect(0, 0, this.bambooFrontCanvas.width, this.bambooFrontCanvas.height);

        const adjustement = 24;
        for (let x = adjustement; x < adjustement + (this.bambooFrontCanvas.width / toPixelSize(1)); x++) {
            if (randomNumb(100) < 8) {
                this.createBamboo(bambooFrontCanvasCtx, Math.round(x * toPixelSize(2)), this.bambooFrontCanvas.height + toPixelSize(32), 2, bambooFrontColors);
            }
        }
    }

    createBamboo(ctx, xStart, yStart, pixelSize, bambooColors) {
        const randomY = toPixelSize(randomNumb(3));
        const endY = yStart + randomY;
        const bambooHeight = toPixelSize(randomNumbOnRange(48, 96));

        ctx.fillStyle = bambooColors.dc;
        ctx.fillRect(xStart, Math.round(endY - bambooHeight), toPixelSize(pixelSize * 4), bambooHeight);

        ctx.fillStyle = bambooColors.mc;
        ctx.fillRect(xStart, Math.round(endY - bambooHeight), toPixelSize(pixelSize), bambooHeight - toPixelSize(pixelSize) - randomY);

        for (let i = 0; i < Math.floor(bambooHeight / toPixelSize(16)); i++) {
            const y = Math.round(endY - bambooHeight + (i * toPixelSize(16)));
            ctx.fillStyle = bambooColors.lc;
            ctx.fillRect(xStart, y, toPixelSize(pixelSize * 4), toPixelSize(pixelSize));
            if (randomNumb(10) < 7) {
                const invert = randomNumb(10) < 5;
                drawSprite(ctx, leaf, toPixelSize(pixelSize), (xStart / toPixelSize(pixelSize)) + (invert ? -5 : 4), (y / toPixelSize(pixelSize)) - 3, bambooColors, invert);
            }
        }
    }
}