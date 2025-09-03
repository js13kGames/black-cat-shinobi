import { SquareObject } from "../../collision-objects/square-object";
import { TileType } from "../../enums/tile-type";
import { convertToMapPixel, toPixelSize } from "../../game-variables";
import { generateBox } from "../../utilities/box-generator";
import { randomNumb } from "../../utilities/general-utilities";

export class Floor {
    constructor(x, y) {
        this.tileType = TileType.FLOOR;
        this.collisionObj = new SquareObject(x * toPixelSize(16), y * toPixelSize(16), toPixelSize(16), toPixelSize(16));
    }

    update() {

    }

    draw(ctx) {
        ctx.fillStyle = "#3d665f";
        ctx.fillRect(this.collisionObj.x, this.collisionObj.y, toPixelSize(16), toPixelSize(16));
        generateBox(ctx,
            convertToMapPixel(this.collisionObj.x), convertToMapPixel(this.collisionObj.y),
            convertToMapPixel(toPixelSize(14)), convertToMapPixel(toPixelSize(14)),
            toPixelSize(2), "#4c8062", () => randomNumb(100) < 5);
    }
}