import { GameVars, toPixelSize } from "../game-variables";
import { heart } from "../sprites/heart";
import { genSmallBox } from "../utilities/box-generator";
import { drawSprite } from "../utilities/draw-utilities";
import { createElem, setElemSize } from "../utilities/elem-utilities";


export class LifeBar {
    constructor(div, size, isMenu) {
        this.size = size;
        this.isMenu = isMenu;

        this.lifeBackgroundCanv = createElem(div, "canvas");
        this.lifeBackgroundCtx = this.lifeBackgroundCanv.getContext("2d");

        this.lifeCanv = createElem(div, "canvas");
        this.lifeCtx = this.lifeCanv.getContext("2d");

        this.draw(GameVars.maxLives);
    }

    draw(centerX, centerY, lifeValue) {
        setElemSize(this.lifeBackgroundCanv, toPixelSize((7 * GameVars.maxLives) + 6) * this.size, toPixelSize(11) * this.size);
        setElemSize(this.lifeCanv, toPixelSize((7 * GameVars.maxLives) + 6) * this.size, toPixelSize(11) * this.size);

        const xPos = centerX - this.lifeBackgroundCanv.width / 2;
        const yPos = centerY - this.lifeBackgroundCanv.height / 2;

        this.lifeBackgroundCanv.style.translate = xPos + 'px ' + yPos + 'px';
        this.lifeCanv.style.translate = (xPos + toPixelSize(2 * this.size)) + 'px ' + yPos + 'px';

        this.lifeBackgroundCtx.clearRect(0, 0, this.lifeBackgroundCanv.width, this.lifeBackgroundCanv.height);
        this.lifeCtx.clearRect(0, 0, this.lifeCanv.width, this.lifeCanv.height);

        if (!this.isMenu) genSmallBox(this.lifeBackgroundCtx, 0, 0, (8 * 3) + 2, 10, toPixelSize(1), "#030f2666", "#030f2666");

        for (let i = 0; i < GameVars.maxLives; i++) {
            drawSprite(this.lifeBackgroundCtx, heart, toPixelSize(this.size), 2 + (8 * i), 2, { "ho": "#2f1519", "hi": "#100f0f" });
            drawSprite(this.lifeCtx, heart, toPixelSize(this.size), (8 * i), 2, { "ho": "#9bf2fa", "hi": "#a80000" });
        }

        this.lifeCtx.clearRect(lifeValue * (this.lifeCanv.width - toPixelSize(3 * this.size)) / 3, 0, this.lifeCanv.width, this.lifeCanv.height);
    }
}