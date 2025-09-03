import { SquareObject } from "../../collision-objects/square-object";
import { TileType } from "../../enums/tile-type";
import { toPixelSize } from "../../game-variables";

export class HouseCeiling {
    constructor(x, y) {
        this.tileType = TileType.HOUSE_CEILING;
        this.collisionObj = new SquareObject(x * toPixelSize(16), y * toPixelSize(16), toPixelSize(16), toPixelSize(8));
    }

    update() {

    }

    draw(ctx) {
        ctx.fillStyle = "#4c8062";
        ctx.fillRect(this.collisionObj.x, this.collisionObj.y, toPixelSize(16), toPixelSize(8));
    }

    convertToMapPixel = (value, amount = 2) => {
        return value / toPixelSize(amount);
    };
}