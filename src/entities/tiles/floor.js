import { SquareObject } from "../../collision-objects/square-object";
import { TileType } from "../../enums/tile-type";
import { convertToMapPixel, toPixelSize } from "../../game-variables";
import { generateBox } from "../../utilities/box-generator";
import { randomNumb } from "../../utilities/general-utilities";

export class Floor {
    constructor(x, y, isAboveGround) {
        this.tileType = TileType.FLOOR;
        this.isCollidable = true;
        this.isAboveGround = isAboveGround;
        this.collisionObj = new SquareObject(x * toPixelSize(16), y * toPixelSize(16), toPixelSize(16), toPixelSize(isAboveGround ? 16 : 32));
    }

    draw(ctx) {
        if (this.isAboveGround) {
            ctx.fillStyle = "#4c7972";
            ctx.fillRect(this.collisionObj.x, this.collisionObj.y, toPixelSize(16), toPixelSize(16));
            ctx.fillStyle = "#3d665f";
            ctx.fillRect(this.collisionObj.x + toPixelSize(2), this.collisionObj.y + toPixelSize(2), toPixelSize(12), toPixelSize(14));
            ctx.fillStyle = "#2c484a";
            ctx.fillRect(this.collisionObj.x, this.collisionObj.y + toPixelSize(2), toPixelSize(2), toPixelSize(14));
            ctx.fillRect(this.collisionObj.x, this.collisionObj.y + toPixelSize(14), toPixelSize(16), toPixelSize(2));
        } else {
            ctx.fillStyle = "#3d665f";
            ctx.fillRect(this.collisionObj.x, this.collisionObj.y, toPixelSize(16), toPixelSize(16));
        }
        generateBox(ctx,
            convertToMapPixel(this.collisionObj.x), convertToMapPixel(this.collisionObj.y), 7, 7,
            toPixelSize(2), this.isAboveGround ? "#2f5851" : "#4c7972", () => randomNumb(100) < 5);
    }
}