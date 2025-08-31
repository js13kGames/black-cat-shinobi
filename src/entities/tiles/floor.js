import { SquareObject } from "../../collision-objects/square-object";
import { toPixelSize } from "../../game-variables";
import { generateBox } from "../../utilities/box-generator";
import { randomNumb } from "../../utilities/general-utilities";

export class Floor{
    constructor(x, y){
        this.collisionObj = new SquareObject(x * toPixelSize(16), y * toPixelSize(16), toPixelSize(16), toPixelSize(16));
    }

    update(){

    }

    draw(ctx){
        ctx.fillStyle = "#41663d";
        ctx.fillRect(this.collisionObj.x, this.collisionObj.y, toPixelSize(16), toPixelSize(16));
        // generateBox(ctx,
        //     this.convertToMapPixel(this.collisionObj.x), this.convertToMapPixel(this.collisionObj.y),
        //     this.convertToMapPixel(toPixelSize(14)), this.convertToMapPixel(toPixelSize(14)),
        //     toPixelSize(2), "#52804d", () => randomNumb(100) < 5);
    }

    convertToMapPixel = (value, amount = 2) => {
        return value / toPixelSize(amount);
    };
}