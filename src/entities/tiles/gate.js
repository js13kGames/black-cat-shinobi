import { SquareObject } from "../../collision-objects/square-object";
import { TileType } from "../../enums/tile-type";
import { toPixelSize } from "../../game-variables";

export class Gate {
    constructor(x, y) {
        this.tileType = TileType.GATE;
        this.isCollidable = false;
        this.collisionObj = new SquareObject((x * toPixelSize(16)) + toPixelSize(10), y * toPixelSize(16), toPixelSize(4), toPixelSize(32));
    }

    draw(ctx) {
        // ctx.fillStyle = "red";
        // ctx.fillRect(this.collisionObj.x, this.collisionObj.y, this.collisionObj.w, this.collisionObj.h);

        const x = this.collisionObj.x - toPixelSize(10);

        ctx.fillStyle = "#100f0f";
        ctx.fillRect(x - toPixelSize(12), this.collisionObj.y - toPixelSize(1), toPixelSize(40), toPixelSize(1));
        ctx.fillRect(x - toPixelSize(8), this.collisionObj.y + toPixelSize(8), toPixelSize(32), toPixelSize(1));

        ctx.fillStyle = "#452228";
        ctx.fillRect(x - toPixelSize(12), this.collisionObj.y - toPixelSize(5), toPixelSize(8), toPixelSize(4));
        ctx.fillRect(x + toPixelSize(20), this.collisionObj.y - toPixelSize(5), toPixelSize(8), toPixelSize(4));
        ctx.fillRect(x - toPixelSize(10), this.collisionObj.y - toPixelSize(4), toPixelSize(36), toPixelSize(4));
        ctx.fillRect(x - toPixelSize(8), this.collisionObj.y + toPixelSize(4), toPixelSize(32), toPixelSize(4));

        ctx.fillRect(x + toPixelSize(6), this.collisionObj.y, toPixelSize(4), toPixelSize(4));
        ctx.fillRect(x - toPixelSize(4), this.collisionObj.y - toPixelSize(4), toPixelSize(4), toPixelSize(36));
        ctx.fillRect(x + toPixelSize(16), this.collisionObj.y - toPixelSize(4), toPixelSize(4), toPixelSize(36));

        ctx.fillStyle = "#1b121c";
        ctx.fillRect(x - toPixelSize(5), this.collisionObj.y + toPixelSize(24), toPixelSize(6), toPixelSize(8));
        ctx.fillRect(x + toPixelSize(15), this.collisionObj.y + toPixelSize(24), toPixelSize(6), toPixelSize(8));

        ctx.fillRect(x - toPixelSize(14), this.collisionObj.y - toPixelSize(7), toPixelSize(10), toPixelSize(3));
        ctx.fillRect(x + toPixelSize(20), this.collisionObj.y - toPixelSize(7), toPixelSize(10), toPixelSize(3));
        ctx.fillRect(x - toPixelSize(4), this.collisionObj.y - toPixelSize(6), toPixelSize(24), toPixelSize(3));

        ctx.fillStyle = "#100f0f";
        ctx.fillRect(x - toPixelSize(10), this.collisionObj.y, toPixelSize(36), toPixelSize(1));
        ctx.fillRect(x - toPixelSize(14), this.collisionObj.y - toPixelSize(5), toPixelSize(10), toPixelSize(1));
        ctx.fillRect(x + toPixelSize(20), this.collisionObj.y - toPixelSize(5), toPixelSize(10), toPixelSize(1));
        ctx.fillRect(x - toPixelSize(4), this.collisionObj.y - toPixelSize(4), toPixelSize(24), toPixelSize(1));

        ctx.fillRect(x - toPixelSize(5), this.collisionObj.y + toPixelSize(4), toPixelSize(1), toPixelSize(4));
        ctx.fillRect(x, this.collisionObj.y + toPixelSize(4), toPixelSize(1), toPixelSize(4));
        ctx.fillRect(x + toPixelSize(15), this.collisionObj.y + toPixelSize(4), toPixelSize(1), toPixelSize(4));
        ctx.fillRect(x + toPixelSize(20), this.collisionObj.y + toPixelSize(4), toPixelSize(1), toPixelSize(4));
    }
}