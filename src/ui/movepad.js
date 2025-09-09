import { InputKey } from "../enums/movement-type";
import { GameVars, toPixelSize } from "../game-variables";
import { CharacterRun, PlayerColors } from "../sprites/character";
import { genSmallBox } from "../utilities/box-generator";
import { drawSprite } from "../utilities/draw-utilities";
import { createElem, setElemSize } from "../utilities/elem-utilities";
import { drawPixelTextInCanvas } from "../utilities/text";

export class MovePad {
    constructor() {
        this.movePadCanv = createElem(GameVars.gameDiv, "canvas", null, null, null, null, null,
            (e) => {
                const canvBox = this.movePadCanv.getBoundingClientRect();
                const touch = e.changedTouches[0];

                const xAmount = ((touch.pageX - canvBox.x) - (this.movePadCanv.width / 2)) / (this.movePadCanv.width / 2);
                const xFinalValue = (Math.abs(xAmount) >= 0.2 ? 1 : 0) * (xAmount < 0 ? -1 : 1);

                let needsRedraw = GameVars.keys[InputKey.LEFT] !== xFinalValue < 0 || GameVars.keys[InputKey.RIGHT] !== xFinalValue > 0;

                GameVars.keys[InputKey.LEFT] = xFinalValue < 0;
                GameVars.keys[InputKey.RIGHT] = xFinalValue > 0;

                needsRedraw && this.update();
            },
            (e) => {
                GameVars.keys[InputKey.LEFT] = false;
                GameVars.keys[InputKey.RIGHT] = false;
                this.update();
            }
        );
        this.movePadCtx = this.movePadCanv.getContext("2d");
        this.update();
    }

    update() {
        setElemSize(this.movePadCanv, toPixelSize(58), toPixelSize(36));
        this.movePadCanv.style.translate = (0) + 'px ' + (GameVars.gameH - this.movePadCanv.height) + 'px';

        this.movePadCtx.clearRect(0, 0, this.movePadCanv.width, this.movePadCanv.height);
        // this.movePadCtx.fillStyle = "red";
        // this.movePadCtx.fillRect(0, 0, this.movePadCanv.width, this.movePadCanv.height);

        genSmallBox(this.movePadCtx, 8, 8, 19, 19, toPixelSize(1), GameVars.keys[InputKey.LEFT] ? "#ffffffaa" : "#00000066", GameVars.keys[InputKey.LEFT] ? "#ffffff66" : "#100f0f66");
        drawSprite(this.movePadCtx, CharacterRun[0], toPixelSize(1), 9, 10, PlayerColors, true);

        genSmallBox(this.movePadCtx, 30, 8, 19, 19, toPixelSize(1), GameVars.keys[InputKey.RIGHT] ? "#ffffffaa" : "#00000066", GameVars.keys[InputKey.RIGHT] ? "#ffffff66" : "#100f0f66");
        drawSprite(this.movePadCtx, CharacterRun[0], toPixelSize(1), 33, 10, PlayerColors);
    }
}