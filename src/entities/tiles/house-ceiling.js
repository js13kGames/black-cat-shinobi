import { SquareObject } from "../../collision-objects/square-object";
import { TileType } from "../../enums/tile-type";
import { GameVars, toPixelSize } from "../../game-variables";
import { Point } from "../point";

export class HouseCeiling {
    constructor(x, y) {
        this.tileType = TileType.HOUSE_CEILING;
        this.isCollidable = true;
        this.pos = new Point(x, y);
        this.collisionObj = new SquareObject(x * toPixelSize(16), y * toPixelSize(16), toPixelSize(16), toPixelSize(8));
    }

    draw(ctx) {
        if (!GameVars.game.board.boardArray[this.pos.y][this.pos.x - 1]) {
            this.drawLeft(ctx);
        } else if (!GameVars.game.board.boardArray[this.pos.y][this.pos.x + 1]) {
            this.drawRight(ctx);
        } else {
            this.drawMiddle(ctx);
        }
    }

    drawLeft(ctx) {
        ctx.fillStyle = "#35555c";
        ctx.fillRect(this.collisionObj.x + toPixelSize(4), this.collisionObj.y, toPixelSize(15), toPixelSize(16));
        ctx.fillStyle = "#272538";
        ctx.fillRect(this.collisionObj.x + toPixelSize(4), this.collisionObj.y, toPixelSize(2), toPixelSize(16));
        ctx.fillStyle = "#100f0f";
        ctx.fillRect(this.collisionObj.x + toPixelSize(6), this.collisionObj.y, toPixelSize(1), toPixelSize(16));
        ctx.fillRect(this.collisionObj.x + toPixelSize(-2), this.collisionObj.y + toPixelSize(5), toPixelSize(18), toPixelSize(1));
        ctx.fillRect(this.collisionObj.x + toPixelSize(3), this.collisionObj.y, toPixelSize(16), toPixelSize(1));
        ctx.fillRect(this.collisionObj.x + toPixelSize(1), this.collisionObj.y + toPixelSize(14), toPixelSize(16), toPixelSize(1));
        ctx.fillStyle = "#1b121c";
        for (let i = 0; i < 4; i++) {
            ctx.fillRect(this.collisionObj.x + toPixelSize(-1 + i), this.collisionObj.y + toPixelSize(4 - i), toPixelSize(17), toPixelSize(1));
        }
        ctx.fillStyle = "#2f1519";
        ctx.fillRect(this.collisionObj.x + toPixelSize(1), this.collisionObj.y + toPixelSize(12), toPixelSize(16), toPixelSize(2));

        this.createLight(ctx, this.collisionObj.x - toPixelSize(2), this.collisionObj.y + toPixelSize(10));

        ctx.fillStyle = "#421a21";
        ctx.fillRect(this.collisionObj.x - toPixelSize(5), this.collisionObj.y + toPixelSize(6), toPixelSize(26), toPixelSize(4));
    }

    drawMiddle(ctx) {
        ctx.fillStyle = "#35555c";
        ctx.fillRect(this.collisionObj.x, this.collisionObj.y, toPixelSize(16), toPixelSize(16));
        ctx.fillStyle = "#272538";
        ctx.fillRect(this.collisionObj.x + toPixelSize(7), this.collisionObj.y, toPixelSize(2), toPixelSize(16));
        ctx.fillStyle = "#1b121c";
        ctx.fillRect(this.collisionObj.x, this.collisionObj.y, toPixelSize(16), toPixelSize(8));
        ctx.fillStyle = "#100f0f";
        ctx.fillRect(this.collisionObj.x, this.collisionObj.y + toPixelSize(5), toPixelSize(16), toPixelSize(1));
        ctx.fillRect(this.collisionObj.x, this.collisionObj.y, toPixelSize(16), toPixelSize(1));
        ctx.fillRect(this.collisionObj.x, this.collisionObj.y + toPixelSize(14), toPixelSize(16), toPixelSize(1));
        ctx.fillStyle = "#2f1519";
        ctx.fillRect(this.collisionObj.x, this.collisionObj.y + toPixelSize(12), toPixelSize(16), toPixelSize(2));

        ctx.fillStyle = "#421a21";
        ctx.fillRect(this.collisionObj.x, this.collisionObj.y + toPixelSize(6), toPixelSize(16), toPixelSize(4));
    }

    drawRight(ctx) {
        ctx.fillStyle = "#35555c";
        ctx.fillRect(this.collisionObj.x, this.collisionObj.y + toPixelSize(8), toPixelSize(10), toPixelSize(16));
        ctx.fillStyle = "#272538";
        ctx.fillRect(this.collisionObj.x + toPixelSize(10), this.collisionObj.y + toPixelSize(8), toPixelSize(2), toPixelSize(16));
        ctx.fillStyle = "#100f0f";
        ctx.fillRect(this.collisionObj.x + toPixelSize(9), this.collisionObj.y + toPixelSize(8), toPixelSize(1), toPixelSize(16));
        ctx.fillRect(this.collisionObj.x, this.collisionObj.y + toPixelSize(5), toPixelSize(18), toPixelSize(1));
        ctx.fillRect(this.collisionObj.x, this.collisionObj.y, toPixelSize(13), toPixelSize(1));
        ctx.fillRect(this.collisionObj.x, this.collisionObj.y + toPixelSize(14), toPixelSize(14), toPixelSize(1));
        ctx.fillStyle = "#1b121c";
        for (let i = 0; i < 4; i++) {
            ctx.fillRect(this.collisionObj.x, this.collisionObj.y + toPixelSize(4 - i), toPixelSize(17 - i), toPixelSize(1));
        }
        ctx.fillStyle = "#2f1519";
        ctx.fillRect(this.collisionObj.x, this.collisionObj.y + toPixelSize(12), toPixelSize(14), toPixelSize(2));

        this.createLight(ctx, this.collisionObj.x + toPixelSize(16), this.collisionObj.y + toPixelSize(10));

        ctx.fillStyle = "#421a21";
        ctx.fillRect(this.collisionObj.x, this.collisionObj.y + toPixelSize(6), toPixelSize(21), toPixelSize(4));
    }

    createLight(ctx, x, y) {
        ctx.fillStyle = "#35555c";
        ctx.fillRect(x, y, toPixelSize(1), toPixelSize(2));
        ctx.fillStyle = "#ffff57";
        ctx.fillRect(x - toPixelSize(1), y + toPixelSize(2), toPixelSize(3), toPixelSize(3));
    }
}