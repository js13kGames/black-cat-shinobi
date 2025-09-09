import { SquareObject } from "../../collision-objects/square-object";
import { TileType } from "../../enums/tile-type";
import { toPixelSize } from "../../game-variables";
import { spike } from "../../sprites/environment";
import { drawSprite } from "../../utilities/draw-utilities";

export class Spikes {
    constructor(x, y, invert, rotate) {
        this.tileType = TileType.SPIKES;
        this.invert = invert;
        this.rotate = rotate;
        this.isCollidable = true;
        this.collisionObj = new SquareObject(x * toPixelSize(16) + toPixelSize(4), y * toPixelSize(16) + toPixelSize(4), toPixelSize(8), toPixelSize(8));
    }

    draw(ctx) {
        for (let x = 0; x < 2; x++) {
            drawSprite(ctx, spike, toPixelSize(2),
                (this.collisionObj.x / toPixelSize(2)) + (4 * (this.rotate ? 0 : x)) - 2,
                (this.collisionObj.y / toPixelSize(2)) + (4 * (this.rotate ? x : 0)) - 2,
                null, this.rotate && this.invert, this.invert && !this.rotate, this.rotate);
        }
        // ctx.fillStyle = "red";
        // ctx.fillRect(this.collisionObj.x, this.collisionObj.y, this.collisionObj.w, this.collisionObj.h);
    }
}