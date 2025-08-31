import { CircleObject } from "../collision-objects/circle-object";
import { SquareObject } from "../collision-objects/square-object";
import { AnimationType } from "../enums/animation-type";
import { InputKey } from "../enums/movement-type";
import { GameVars, toPixelSize } from "../game-variables";
import { CharacterFrontIddle, PlayerColors } from "../sprites/character";
import { checkForCollisions } from "../utilities/collision-utilities";
import { drawSprite } from "../utilities/draw-utilities";
import { createElem } from "../utilities/elem-utilities";
import { CharAnimation } from "./char-animation";
import { Point } from "./point";

export class Player{
    constructor(){
        this.playerSpeed = toPixelSize(80);
        this.collisionObj = new SquareObject(1 * toPixelSize(16), 1 * toPixelSize(16), toPixelSize(16), toPixelSize(16));
        this.fakeMovRect = new SquareObject(this.collisionObj.x, this.collisionObj.y, this.collisionObj.w, this.collisionObj.h);

        this.charAnim = new CharAnimation();
        this.animationType = AnimationType.IDDLE;
        this.animationDir = 0;

        this.gravityMultiplier = 1;
    }

    update(){
        this.handleInputMov();
        this.handleGravity();

        this.charAnim.update(this.animationType, this.animationDir);
    }

    handleInputMov() {
        let newRectX = this.collisionObj.x;
        let newRectY = this.collisionObj.y;

        this.animationType = AnimationType.IDDLE;

        const distance = this.playerSpeed * GameVars.deltaTime;
        if (GameVars.keys[InputKey.DOWN]) { newRectY += distance; this.animationType = AnimationType.FALL;}
        if (GameVars.keys[InputKey.RIGHT]) { newRectX += distance; this.animationType = AnimationType.RUN; this.animationDir = 1;}
        if (GameVars.keys[InputKey.LEFT]) { newRectX -= distance; this.animationType = AnimationType.RUN; this.animationDir = -1;}
        if (GameVars.keys[InputKey.JUMP]) { newRectY -= distance * 2; this.animationType = AnimationType.JUMP;}

        this.validateMovement(this.collisionObj.x, newRectY);
        this.validateMovement(newRectX, this.collisionObj.y);
    }

    handleGravity(){
        let newRectY = this.collisionObj.y;
        newRectY += this.playerSpeed * GameVars.gravity * this.gravityMultiplier * GameVars.deltaTime;
        this.fakeMovRect.x = Math.round(this.collisionObj.x);
        this.fakeMovRect.y = Math.round(newRectY);
        if(checkForCollisions(this.fakeMovRect, (rect) => {
            this.gravityMultiplier+= 0.1;
            if(this.gravityMultiplier > 4) this.animationType = AnimationType.FALL;
            this.move(rect);
        })){
            this.gravityMultiplier = 1;
        }
    }

    validateMovement(x, y, ignoreCollisions) {
        this.fakeMovRect.x = Math.round(x);
        this.fakeMovRect.y = Math.round(y);
        ignoreCollisions ? this.move(this.fakeMovRect) : checkForCollisions(this.fakeMovRect, (rect) => this.move(rect)) && 
        this.animationType === AnimationType.FALL && (this.animationType = AnimationType.IDDLE);
    }

    move(rect) {
        this.collisionObj.x = rect.x;
        this.collisionObj.y = rect.y;
    }

    draw(ctx){
        // ctx.fillStyle = "red";
        // ctx.fillRect(this.collisionObj.x, this.collisionObj.y, this.collisionObj.w , this.collisionObj.h);
        drawSprite(ctx,this.charAnim.getSpriteToDraw(),toPixelSize(1),this.collisionObj.x / toPixelSize(1),this.collisionObj.y/ toPixelSize(1),PlayerColors,this.charAnim.isInverted);
    }
}