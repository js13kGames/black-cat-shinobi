import { SquareObject } from "../collision-objects/square-object";
import { AnimationType } from "../enums/animation-type";
import { InputKey } from "../enums/movement-type";
import { TileType } from "../enums/tile-type";
import { GameVars, toPixelSize } from "../game-variables";
import { PlayerColors } from "../sprites/character";
import { checkForCollisions } from "../utilities/collision-utilities";
import { drawSprite } from "../utilities/draw-utilities";
import { createElem, setElemSize } from "../utilities/elem-utilities";
import { CharAnimation } from "./char-animation";

export class Player {
    constructor() {
        this.playerCanv = createElem(GameVars.gameDiv, "canvas");
        this.playerCanvCtx = this.playerCanv.getContext("2d");
        this.playJumpSound;
        this.playFallSound;
        this.clearSoundDelay = 0;
    }

    reset(x, y) {
        this.playerCanv.style.translate = "";
        setElemSize(this.playerCanv, toPixelSize(16), toPixelSize(16));

        this.playerSpeed = toPixelSize(100);
        this.collisionObj = new SquareObject(toPixelSize(x * 16), toPixelSize((y * 16) - 32), toPixelSize(8), toPixelSize(8));
        this.fakeMovRect = new SquareObject(this.collisionObj.x, this.collisionObj.y, this.collisionObj.w, this.collisionObj.h);

        this.charAnim = new CharAnimation();
        this.animationType = AnimationType.IDDLE;
        this.animationDir = 0;

        this.gravityMultiplier = 1;
    }

    update() {
        this.handleInputMov();
        this.handleGravity();
        this.sideWallJump();

        this.charAnim.update(this.animationType, this.animationDir);

        this.draw();

        if (this.animationType === AnimationType.RUN) GameVars.sound.walkSound();


        this.clearSoundDelay += GameVars.deltaTime;
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

        if (this.collisionObj.y !== newRectY) this.validateMovement(this.collisionObj.x, newRectY);
        if (this.collisionObj.x !== newRectX) this.validateMovement(newRectX, this.collisionObj.y);

        if (!this.playJumpSound && this.animationType === AnimationType.JUMP) {
            this.playJumpSound = true;
            GameVars.sound.jumpSound();
        }

        if (!this.playFallSound && this.animationType === AnimationType.FALL) {
            this.playFallSound = true;
            GameVars.sound.fallSound();
        }
    }

    handleGravity() {
        let newRectY = this.collisionObj.y;
        newRectY += this.playerSpeed * GameVars.gravity * this.gravityMultiplier * GameVars.deltaTime;
        this.fakeMovRect.x = Math.round(this.collisionObj.x);
        this.fakeMovRect.y = Math.round(newRectY);
        if (checkForCollisions(this.collisionObj, this.fakeMovRect, (rect) => {
            this.gravityMultiplier += 6 * GameVars.deltaTime;
            if (this.gravityMultiplier > 4) this.animationType = AnimationType.FALL;
            this.move(rect);
        }, true)) {
            if (this.clearSoundDelay >= 0.2) {
                this.clearSoundDelay = 0;
                this.playJumpSound = false;
                this.playFallSound = false;
            }
            this.gravityMultiplier = 1;
        }
    }

    sideWallJump() {
        if (this.animationType !== AnimationType.JUMP && GameVars.keys[InputKey.JUMP]) {
            let newRectX = this.collisionObj.x;

            const distance = this.playerSpeed * GameVars.deltaTime;
            if (GameVars.keys[InputKey.RIGHT]) { newRectX += distance; this.animationDir = 1; }
            if (GameVars.keys[InputKey.LEFT]) { newRectX -= distance; this.animationDir = -1; }

            this.fakeMovRect.x = Math.round(newRectX);
            this.fakeMovRect.y = this.collisionObj.y;

            if (checkForCollisions(this.collisionObj, this.fakeMovRect, () => { }) === TileType.STONE) {
                this.animationType === AnimationType.JUMP;
                this.resetGravity();
            }
        }
    }

    resetGravity() {
        if (this.clearSoundDelay >= 0.2) {
            this.clearSoundDelay = 0;
            this.playJumpSound = false;
            this.playFallSound = false;
        }
        this.gravityMultiplier = 1;
    }

    validateMovement(x, y) {
        this.fakeMovRect.x = Math.round(x);
        this.fakeMovRect.y = Math.round(y);
        checkForCollisions(this.collisionObj, this.fakeMovRect, (rect) => this.move(rect)) &&
            this.animationType === AnimationType.FALL && (this.animationType = AnimationType.IDDLE);
    }

    move(rect) {
        this.collisionObj.x = rect.x;
        this.collisionObj.y = rect.y;

        let drawX = this.collisionObj.x < GameVars.gameHalfW ? this.collisionObj.x : GameVars.gameHalfW;
        drawX = this.collisionObj.x > GameVars.levelW - GameVars.gameHalfW ? GameVars.gameHalfW * 2 - (GameVars.levelW - this.collisionObj.x) : drawX;

        let drawY = this.collisionObj.y + GameVars.game.camPos.y;

        this.playerCanv.style.translate = (drawX - toPixelSize(4)) + 'px ' + (drawY - toPixelSize(4)) + 'px';
    }

    draw() {
        this.playerCanvCtx.clearRect(0, 0, this.playerCanv.width, this.playerCanv.height);
        // this.playerCanvCtx.fillStyle = "red";
        // this.playerCanvCtx.fillRect(toPixelSize(4), toPixelSize(0), this.collisionObj.w, this.collisionObj.h);
        drawSprite(this.playerCanvCtx, this.charAnim.getSpriteToDraw(), toPixelSize(1), 0, 0, PlayerColors, this.charAnim.isInverted);
    }
}