import { InputKey } from "../enums/movement-type";
import { GameVars, toPixelSize } from "../game-variables";
import { CharacterFall, CharacterJump, PlayerColors } from "../sprites/character";
import { genSmallBox } from "../utilities/box-generator";
import { drawSprite } from "../utilities/draw-utilities";
import { createElem, setElemSize } from "../utilities/elem-utilities";

export class ActionPad {
    constructor() {
        this.movePadCanv = createElem(GameVars.gameDiv, "canvas", null, null, null, null, GameVars.isMobile, null,
            (e) => {
                const canvBox = this.movePadCanv.getBoundingClientRect();
                const touch = e.changedTouches[0];

                const xAmount = ((touch.pageX - canvBox.x) - (this.movePadCanv.width / 2)) / (this.movePadCanv.width / 2);
                const xFinalValue = (Math.abs(xAmount) >= 0.2 ? 1 : 0) * (xAmount < 0 ? -1 : 1);

                let needsRedraw = GameVars.keys[InputKey.DOWN] !== xFinalValue < 0 || GameVars.keys[InputKey.JUMP] !== xFinalValue > 0;

                GameVars.keys[InputKey.DOWN] = xFinalValue < 0;
                GameVars.keys[InputKey.JUMP] = xFinalValue > 0;

                needsRedraw && this.update();
            },
            (e) => {
                GameVars.keys[InputKey.DOWN] = false;
                GameVars.keys[InputKey.JUMP] = false;
                this.update();
            }
        );
        this.movePadCtx = this.movePadCanv.getContext("2d");
        this.update();
    }

    update() {
        setElemSize(this.movePadCanv, toPixelSize(42), toPixelSize(20));
        this.movePadCanv.style.translate = (GameVars.gameW - toPixelSize(42 + 8)) + 'px ' + (GameVars.gameH - toPixelSize(20 + 8)) + 'px';


        this.movePadCtx.clearRect(0, 0, this.movePadCanv.width, this.movePadCanv.height);
        // this.movePadCtx.fillStyle = "red";
        // this.movePadCtx.fillRect(0, 0, this.movePadCanv.width, this.movePadCanv.height);

        genSmallBox(this.movePadCtx, 0, 0, 19, 19, toPixelSize(1), GameVars.keys[InputKey.DOWN] ? "#ffffffaa" : "#00000066", GameVars.keys[InputKey.DOWN] ? "#ffffff66" : "#100f0f66");
        drawSprite(this.movePadCtx, CharacterFall[0], toPixelSize(1), 3, 2, PlayerColors, true);

        genSmallBox(this.movePadCtx, 22, 0, 19, 19, toPixelSize(1), GameVars.keys[InputKey.JUMP] ? "#ffffffaa" : "#00000066", GameVars.keys[InputKey.JUMP] ? "#ffffff66" : "#100f0f66");
        drawSprite(this.movePadCtx, CharacterJump[0], toPixelSize(1), 23, 2, PlayerColors);
    }
}