import { AnimationType } from "../enums/animation-type";
import { InputKey } from "../enums/movement-type";
import { GameVars } from "../game-variables";
import { CharacterFall, CharacterJump, CharacterRun, CharacterSideIddle } from "../sprites/character";

export class CharAnimation {
    constructor() {
        this.animSpeed = 0.4;
        this.currentSprite = CharacterSideIddle;
        this.isInverted;
        this.lastDirection = 9;
        this.framePos = 0;
        this.timerToNextFrame = 0;
    }

    update(animationType, animationDir) {
        switch (animationType) {
            case AnimationType.IDDLE:
                this.updateAnim(animationDir, 0.4, CharacterSideIddle);
                break;
            case AnimationType.RUN:
                this.updateAnim(animationDir, 0.05, CharacterRun);
                break;
            case AnimationType.JUMP:
                this.updateAnim(animationDir, 0.1, CharacterJump);
                break;
            case AnimationType.FALL:
                this.updateAnim(animationDir, 0.1, CharacterFall);
                break;
        }
    }

    updateAnim(animationDir, animSpeed, sprites) {
        if (this.lastDirection === animationDir && this.currentSprite === sprites) {
            this.updateFrame();
        } else {
            this.resetVars(animationDir, animSpeed, sprites);
        }
    }

    updateFrame() {
        if (this.timerToNextFrame > this.animSpeed) {
            this.timerToNextFrame = 0;
            if (this.framePos + 1 >= this.currentSprite.length) {
                this.framePos = 0;
            } else {
                this.framePos++;
            }
        } else {
            this.timerToNextFrame += GameVars.deltaTime;
        }
    }

    resetVars(animationDir, animSpeed, spriteArray) {
        this.isInverted = animationDir === -1;
        this.animSpeed = animSpeed;
        this.lastDirection = animationDir;
        this.currentSprite = spriteArray;
        this.framePos = 0;
        this.timerToNextFrame = 0;
    }

    getSpriteToDraw() {
        return this.currentSprite[this.framePos];
    }
}