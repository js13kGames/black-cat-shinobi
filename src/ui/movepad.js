import { InputKey } from "../enums/movement-type";
import { GameVars, toPixelSize } from "../game-variables";
import { genSmallBox } from "../utilities/box-generator";
import { createElem, setElemSize } from "../utilities/elem-utilities";
import { drawPixelTextInCanvas } from "../utilities/text";

export class MovePad {
    constructor() {
        this.movePadCanv = createElem(GameVars.gameDiv, "canvas", null, null, null, null, GameVars.isMobile, null,
            (e) => {
                const canvBox = this.movePadCanv.getBoundingClientRect();
                const touch = e.changedTouches[0];

                const xAmount = ((touch.pageX - canvBox.x) - (this.movePadCanv.width / 2)) / (this.movePadCanv.width / 2);
                const yAmount = ((touch.pageY - canvBox.y) - (this.movePadCanv.height / 2)) / (this.movePadCanv.height / 2);

                const xFinalValue = (Math.abs(xAmount) >= 0.2 ? 1 : 0) * (xAmount < 0 ? -1 : 1);
                const yFinalValue = (Math.abs(yAmount) >= 0.2 ? 1 : 0) * (yAmount < 0 ? -1 : 1);

                let needsRedraw = GameVars.keys[InputKey.UP] !== yFinalValue < 0 ||
                    GameVars.keys[InputKey.DOWN] !== yFinalValue > 0 ||
                    GameVars.keys[InputKey.LEFT] !== xFinalValue < 0 ||
                    GameVars.keys[InputKey.RIGHT] !== xFinalValue > 0;

                GameVars.keys[InputKey.UP] = yFinalValue < 0;
                GameVars.keys[InputKey.DOWN] = yFinalValue > 0;
                GameVars.keys[InputKey.LEFT] = xFinalValue < 0;
                GameVars.keys[InputKey.RIGHT] = xFinalValue > 0;

                needsRedraw && this.update();
            },
            (e) => {
                GameVars.keys[InputKey.UP] = false;
                GameVars.keys[InputKey.DOWN] = false;
                GameVars.keys[InputKey.LEFT] = false;
                GameVars.keys[InputKey.RIGHT] = false;
                this.update();
            }
        );
        this.movePadCtx = this.movePadCanv.getContext("2d");
        this.update();
    }

    update() {
        setElemSize(this.movePadCanv, toPixelSize(32), toPixelSize(32));
        this.movePadCanv.style.translate = toPixelSize(12) + 'px ' + (GameVars.gameH - this.movePadCanv.height - toPixelSize(12)) + 'px';

        this.movePadCtx.clearRect(0, 0, this.movePadCanv.width, this.movePadCanv.height);

        genSmallBox(this.movePadCtx, 13, 13, 6, 6, toPixelSize(1), "#ffff57", "#100f0f66");

        genSmallBox(this.movePadCtx, 11, 1, 10, 10, toPixelSize(1), GameVars.keys[InputKey.JUMP] ? "#ffffffaa" : "#00000066", GameVars.keys[InputKey.JUMP] ? "#ffffff66" : "#100f0f66");
        drawPixelTextInCanvas('^', this.movePadCtx, toPixelSize(2), 8.25, 3.5, "#edeef7aa", 1);

        genSmallBox(this.movePadCtx, 1, 11, 10, 10, toPixelSize(1), GameVars.keys[InputKey.LEFT] ? "#ffffffaa" : "#00000066", GameVars.keys[InputKey.LEFT] ? "#ffffff66" : "#100f0f66");
        drawPixelTextInCanvas('<', this.movePadCtx, toPixelSize(2), 3.5, 8.25, "#edeef7aa", 1);

        genSmallBox(this.movePadCtx, 21, 11, 10, 10, toPixelSize(1), GameVars.keys[InputKey.RIGHT] ? "#ffffffaa" : "#00000066", GameVars.keys[InputKey.RIGHT] ? "#ffffff66" : "#100f0f66");
        drawPixelTextInCanvas('>', this.movePadCtx, toPixelSize(2), 13, 8.25, "#edeef7aa", 1);

        genSmallBox(this.movePadCtx, 11, 21, 10, 10, toPixelSize(1), GameVars.keys[InputKey.DOWN] ? "#ffffffaa" : "#00000066", GameVars.keys[InputKey.DOWN] ? "#ffffff66" : "#100f0f66");
        drawPixelTextInCanvas('~', this.movePadCtx, toPixelSize(2), 8.25, 13, "#edeef7aa", 1);
    }
}