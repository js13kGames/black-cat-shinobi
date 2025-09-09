import { SquareObject } from "../../collision-objects/square-object";
import { TileType } from "../../enums/tile-type";
import { convertToMapPixel, GameVars, toPixelSize } from "../../game-variables";
import { generateBox } from "../../utilities/box-generator";
import { randomNumb } from "../../utilities/general-utilities";

export class Stone {
    constructor(x, y) {
        this.tileType = TileType.STONE;
        this.isCollidable = true;
        this.collisionObj = new SquareObject(x * toPixelSize(16), y * toPixelSize(16), toPixelSize(16), toPixelSize(16));
    }

    draw(ctx) {
        ctx.fillStyle = "#686b7a";
        ctx.fillRect(this.collisionObj.x, this.collisionObj.y, toPixelSize(16), toPixelSize(16));
        generateBox(ctx,
            convertToMapPixel(this.collisionObj.x), convertToMapPixel(this.collisionObj.y),
            convertToMapPixel(this.collisionObj.w - toPixelSize(2)), convertToMapPixel(this.collisionObj.h - toPixelSize(2)),
            toPixelSize(2), "#3e3846", (x, y, endX, endY) => {
                return randomNumb(100) < 6 || x === 0 || y === endY;
            });
        generateBox(ctx,
            convertToMapPixel(this.collisionObj.x), convertToMapPixel(this.collisionObj.y),
            convertToMapPixel(this.collisionObj.w - toPixelSize(2)), convertToMapPixel(this.collisionObj.h - toPixelSize(2)),
            toPixelSize(2), "#999a9e", (x, y, endX, endY) => x === endX || y === 0);
    }
}