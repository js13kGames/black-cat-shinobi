import { CircleObject } from "../collision-objects/circle-object";
import { SquareObject } from "../collision-objects/square-object";
import { AnimationType } from "../enums/animation-type";
import { GameState } from "../enums/game-state";
import { InputKey } from "../enums/movement-type";
import { GameVars, toPixelSize } from "../game-variables";
import { CharacterFrontIddle, PlayerColors } from "../sprites/character";
import { checkForCollisions } from "../utilities/collision-utilities";
import { drawSprite } from "../utilities/draw-utilities";
import { createElem } from "../utilities/elem-utilities";
import { CharAnimation } from "./char-animation";
import { Point } from "./point";

export class Player {
    constructor() {
        this.playerCanv = createElem(GameVars.gameDiv, "canvas", null, null, toPixelSize(16), toPixelSize(16));
        this.playerCanvCtx = this.playerCanv.getContext("2d");
        this.reset();
    }

    reset() {
        this.playerCanv.style.translate = "";

        this.playerSpeed = toPixelSize(80);
        this.collisionObj = new SquareObject(toPixelSize(20), toPixelSize(16), toPixelSize(8), toPixelSize(16));
        this.fakeMovRect = new SquareObject(this.collisionObj.x, this.collisionObj.y, this.collisionObj.w, this.collisionObj.h);

        this.charAnim = new CharAnimation();
        this.animationType = AnimationType.IDDLE;
        this.animationDir = 0;

        this.gravityMultiplier = 1;
    }

    update() {
        this.handleInputMov();
        this.handleGravity();

        this.charAnim.update(this.animationType, this.animationDir);

        this.draw();
    }

    handleInputMov() {
        let newRectX = this.collisionObj.x;
        let newRectY = this.collisionObj.y;

        this.animationType = AnimationType.IDDLE;

        const distance = this.playerSpeed * GameVars.deltaTime;
        if (GameVars.keys[InputKey.DOWN]) { newRectY += distance; this.animationType = AnimationType.FALL; }
        if (GameVars.keys[InputKey.RIGHT]) { newRectX += distance; this.animationType = AnimationType.RUN; this.animationDir = 1; }
        if (GameVars.keys[InputKey.LEFT]) { newRectX -= distance; this.animationType = AnimationType.RUN; this.animationDir = -1; }
        if (GameVars.keys[InputKey.JUMP]) { newRectY -= distance * 2; this.animationType = AnimationType.JUMP; }

        this.validateMovement(this.collisionObj.x, newRectY);
        this.validateMovement(newRectX, this.collisionObj.y);
    }

    handleGravity() {
        let newRectY = this.collisionObj.y;
        newRectY += this.playerSpeed * GameVars.gravity * this.gravityMultiplier * GameVars.deltaTime;
        this.fakeMovRect.x = Math.round(this.collisionObj.x);
        this.fakeMovRect.y = Math.round(newRectY);
        if (checkForCollisions(this.collisionObj, this.fakeMovRect, (rect) => {
            this.gravityMultiplier += 0.1;
            if (this.gravityMultiplier > 4) this.animationType = AnimationType.FALL;
            this.move(rect);
        }, true)) {
            this.gravityMultiplier = 1;
        }
    }

    validateMovement(x, y, ignoreCollisions) {
        this.fakeMovRect.x = Math.round(x);
        this.fakeMovRect.y = Math.round(y);
        ignoreCollisions ? this.move(this.fakeMovRect) : checkForCollisions(this.collisionObj, this.fakeMovRect, (rect) => this.move(rect)) &&
            this.animationType === AnimationType.FALL && (this.animationType = AnimationType.IDDLE);
    }

    move(rect) {
        this.collisionObj.x = rect.x;
        this.collisionObj.y = rect.y;
        let drawX = this.collisionObj.x < GameVars.gameHW ? this.collisionObj.x : GameVars.gameHW;
        drawX = this.collisionObj.x > GameVars.levelW - GameVars.gameHW ? GameVars.gameHW * 2 - (GameVars.levelW - this.collisionObj.x) : drawX;
        this.playerCanv.style.translate = (drawX - toPixelSize(4)) + 'px ' + (this.collisionObj.y + toPixelSize(4)) + 'px';
    }

    draw() {
        this.playerCanvCtx.clearRect(0, 0, this.playerCanv.width, this.playerCanv.height);
        // this.playerCanvCtx.fillStyle = "red";
        // this.playerCanvCtx.fillRect(toPixelSize(4), 0, this.collisionObj.w, this.collisionObj.h);
        drawSprite(this.playerCanvCtx, this.charAnim.getSpriteToDraw(), toPixelSize(1), 0, 0, PlayerColors, this.charAnim.isInverted);
    }
}