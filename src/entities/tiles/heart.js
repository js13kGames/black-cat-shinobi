import { SquareObject } from "../../collision-objects/square-object";
import { TileType } from "../../enums/tile-type";
import { toPixelSize } from "../../game-variables";
import { heart } from "../../sprites/heart";
import { drawSprite } from "../../utilities/draw-utilities";

export class Heart {
    constructor(x, y) {
        this.tileType = TileType.HEART;
        this.isCollidable = false;
        this.collisionObj = new SquareObject(x * toPixelSize(16) + toPixelSize(5), y * toPixelSize(16) + toPixelSize(5), toPixelSize(7), toPixelSize(7));
    }

    draw(ctx) {
        // ctx.fillStyle = "red";
        // ctx.fillRect(this.collisionObj.x, this.collisionObj.y, this.collisionObj.w, this.collisionObj.h);
        drawSprite(ctx, heart, toPixelSize(1), this.collisionObj.x / toPixelSize(1), this.collisionObj.y / toPixelSize(1), { "ho": "#9bf2fa", "hi": "#a80000" });
    }
}