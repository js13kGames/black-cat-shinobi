import { SquareObject } from "../../collision-objects/square-object";
import { TileType } from "../../enums/tile-type";
import { convertToMapPixel, toPixelSize } from "../../game-variables";
import { generateBox } from "../../utilities/box-generator";
import { randomNumb } from "../../utilities/general-utilities";

export class Hole {
    constructor(x, y) {
        this.tileType = TileType.HOLE;
        this.isCollidable = false;
        this.collisionObj = new SquareObject(x * toPixelSize(16), y * toPixelSize(16), toPixelSize(16), toPixelSize(16));
    }

    draw(ctx) {
        ctx.fillStyle = "#100f0f";
        ctx.fillRect(this.collisionObj.x, this.collisionObj.y, toPixelSize(16), toPixelSize(64));
        generateBox(ctx,
            convertToMapPixel(this.collisionObj.x), convertToMapPixel(this.collisionObj.y),
            convertToMapPixel(toPixelSize(14)), convertToMapPixel(toPixelSize(16)),
            toPixelSize(2), "#2f1519", () => randomNumb(100) < 50);
        ctx.fillStyle = "#2c484a";
        ctx.fillRect(this.collisionObj.x, this.collisionObj.y, toPixelSize(16), toPixelSize(8));
        generateBox(ctx,
            convertToMapPixel(this.collisionObj.x), convertToMapPixel(this.collisionObj.y),
            convertToMapPixel(toPixelSize(16)), convertToMapPixel(toPixelSize(8)),
            toPixelSize(2), "#2f5851", () => randomNumb(100) < 10);
    }
}