import { InputKey } from "../enums/movement-type";
import { GameVars, toPixelSize } from "../game-variables";
import { CharacterJump, PlayerColors } from "../sprites/character";
import { genSmallBox } from "../utilities/box-generator";
import { drawSprite } from "../utilities/draw-utilities";
import { createElem, setElemSize } from "../utilities/elem-utilities";

export class ActionPad {
    constructor() {
        this.jumpCanv = createElem(GameVars.gameDiv, "canvas", null, null, null, null, GameVars.isMobile, null,
            (e) => {
                let needsRedraw = !GameVars.keys[InputKey.JUMP];
                GameVars.keys[InputKey.JUMP] = true;
                needsRedraw && this.update();
            },
            (e) => {
                GameVars.keys[InputKey.JUMP] = false;
                this.update();
            }
        );
        this.jumpCtx = this.jumpCanv.getContext("2d");
        this.update();
    }

    update() {
        setElemSize(this.jumpCanv, toPixelSize(20), toPixelSize(20));
        this.jumpCanv.style.translate = (GameVars.gameW - toPixelSize(20 + 16)) + 'px ' + (GameVars.gameH - toPixelSize(20 + 16)) + 'px';

        let isTouch = GameVars.keys[InputKey.JUMP];
        this.jumpCtx.clearRect(0, 0, this.jumpCanv.width, this.jumpCanv.height);
        genSmallBox(this.jumpCtx, 0, 0, 19, 19, toPixelSize(1), isTouch ? "#ffffffaa" : "#00000066", isTouch ? "#ffffff66" : "#100f0f66");
        drawSprite(this.jumpCtx, CharacterJump[0], toPixelSize(1), 0, 2, PlayerColors);
    }
}