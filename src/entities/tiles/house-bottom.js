import { SquareObject } from "../../collision-objects/square-object";
import { TileType } from "../../enums/tile-type";
import { GameVars, toPixelSize } from "../../game-variables";
import { Point } from "../point";

export class HouseBottom {
    constructor(x, y, isFloor) {
        this.tileType = TileType.HOUSE_BOTTOM;
        this.isFloor = isFloor;
        this.isCollidable = false;
        this.pos = new Point(x, y);
        this.collisionObj = new SquareObject(x * toPixelSize(16), y * toPixelSize(16), toPixelSize(16), toPixelSize(16));
    }

    draw(ctx) {
        if (!GameVars.game.board.boardArray[this.pos.y][this.pos.x - 1]) {
            this.drawLeft(ctx);
        } else if (!GameVars.game.board.boardArray[this.pos.y][this.pos.x + 1]) {
            this.drawRight(ctx);
        } else {
            this.drawMiddle(ctx);
        }
        ctx.fillStyle = "#100f0f";
    }

    drawLeft(ctx) {
        ctx.fillStyle = "#35555c";
        ctx.fillRect(this.collisionObj.x + toPixelSize(4), this.collisionObj.y, toPixelSize(12), toPixelSize(16));
        ctx.fillStyle = "#272538";
        ctx.fillRect(this.collisionObj.x + toPixelSize(4), this.collisionObj.y + toPixelSize(12), toPixelSize(12), toPixelSize(2));
        ctx.fillRect(this.collisionObj.x + toPixelSize(4), this.collisionObj.y, toPixelSize(2), toPixelSize(16));
        ctx.fillStyle = "#100f0f";
        ctx.fillRect(this.collisionObj.x + toPixelSize(6), this.collisionObj.y, toPixelSize(1), toPixelSize(16));
        if (this.isFloor) {
            ctx.fillRect(this.collisionObj.x + toPixelSize(2), this.collisionObj.y + toPixelSize(10), toPixelSize(14), toPixelSize(1));
            ctx.fillStyle = "#2f1519";
            ctx.fillRect(this.collisionObj.x + toPixelSize(2), this.collisionObj.y + toPixelSize(8), toPixelSize(14), toPixelSize(2));
            ctx.fillRect(this.collisionObj.x + toPixelSize(4), this.collisionObj.y + toPixelSize(8), toPixelSize(2), toPixelSize(8));
        }
    }

    drawMiddle(ctx) {
        ctx.fillStyle = "#35555c";
        ctx.fillRect(this.collisionObj.x, this.collisionObj.y, toPixelSize(16), toPixelSize(16));
        ctx.fillStyle = "#272538";
        ctx.fillRect(this.collisionObj.x, this.collisionObj.y + toPixelSize(12), toPixelSize(16), toPixelSize(2));
        ctx.fillRect(this.collisionObj.x + toPixelSize(7), this.collisionObj.y, toPixelSize(2), toPixelSize(16));
        if (this.isFloor) {
            ctx.fillStyle = "#100f0f";
            ctx.fillRect(this.collisionObj.x, this.collisionObj.y + toPixelSize(10), toPixelSize(16), toPixelSize(1));
            ctx.fillStyle = "#2f1519";
            ctx.fillRect(this.collisionObj.x, this.collisionObj.y + toPixelSize(8), toPixelSize(16), toPixelSize(2));
            ctx.fillRect(this.collisionObj.x + toPixelSize(7), this.collisionObj.y + toPixelSize(8), toPixelSize(2), toPixelSize(8));
            ctx.fillRect(this.collisionObj.x + toPixelSize(-1), this.collisionObj.y + toPixelSize(8), toPixelSize(2), toPixelSize(8));
        }
    }

    drawRight(ctx) {
        ctx.fillStyle = "#35555c";
        ctx.fillRect(this.collisionObj.x, this.collisionObj.y, toPixelSize(10), toPixelSize(16));
        ctx.fillStyle = "#272538";
        ctx.fillRect(this.collisionObj.x, this.collisionObj.y + toPixelSize(12), toPixelSize(10), toPixelSize(2));
        ctx.fillRect(this.collisionObj.x + toPixelSize(10), this.collisionObj.y, toPixelSize(2), toPixelSize(16));
        ctx.fillStyle = "#100f0f";
        ctx.fillRect(this.collisionObj.x + toPixelSize(9), this.collisionObj.y, toPixelSize(1), toPixelSize(16));
        if (this.isFloor) {
            ctx.fillRect(this.collisionObj.x, this.collisionObj.y + toPixelSize(10), toPixelSize(14), toPixelSize(1));
            ctx.fillStyle = "#2f1519";
            ctx.fillRect(this.collisionObj.x, this.collisionObj.y + toPixelSize(8), toPixelSize(14), toPixelSize(2));
            ctx.fillRect(this.collisionObj.x + toPixelSize(10), this.collisionObj.y + toPixelSize(8), toPixelSize(2), toPixelSize(8));
            ctx.fillRect(this.collisionObj.x + toPixelSize(-1), this.collisionObj.y + toPixelSize(8), toPixelSize(2), toPixelSize(8));
        }
    }
}