import { getInputKey, InputKey } from "./enums/movement-type";
import { Game } from "./game";
import { GameVars, toPixelSize } from "./game-variables";
import { CharacterAtk, CharacterFrontIddle, CharacterJump, CharacterRun, CharacterSideIddle, EnemyColors, PlayerColors, Shuriken } from "./sprites/character";
import {createElem} from "./utilities/elem-utilities"
const { drawSprite } = require("./utilities/draw-utilities");

const getTime = typeof performance === 'function' ? performance.now : Date.now;
let fpsInterval = 1000 / GameVars.fps;
let then = getTime();
let elapsed;

const init = () => {
    GameVars.updatePixelSize(window.innerWidth, window.innerHeight);

    addKeyListenerEvents();
    createGameElements();

    // const mainDiv = document.getElementById("main");
    // const mainMenuCanv = createElem(mainDiv, "canvas", null, null, GameVars.gameW, GameVars.gameH, GameVars.isMobile, "#a8a8a8");
    // const mainMenuCtx = mainMenuCanv.getContext("2d");

    // drawCharacter(mainMenuCtx, 2, 0, 0, CharacterFrontIddle[0], PlayerColors);
    // drawCharacter(mainMenuCtx, 2, 0, 16, CharacterFrontIddle[1], PlayerColors);
    // drawCharacter(mainMenuCtx, 2, 16, 0, CharacterSideIddle[0], PlayerColors);
    // drawCharacter(mainMenuCtx, 2, 16, 16, CharacterSideIddle[1], PlayerColors);
    // drawCharacter(mainMenuCtx, 2, 32, 0, CharacterJump[0], PlayerColors);
    // drawCharacter(mainMenuCtx, 2, 48, 0, CharacterJump[1], PlayerColors);
    // drawCharacter(mainMenuCtx, 2, 32, 16, CharacterRun[0], PlayerColors);
    // drawCharacter(mainMenuCtx, 2, 48, 16, CharacterRun[1], PlayerColors);
    // drawCharacter(mainMenuCtx, 2, 64, 16, CharacterAtk, PlayerColors);
    // drawCharacter(mainMenuCtx, 2, 64, 16, CharacterAtk, PlayerColors);
    // drawCharacter(mainMenuCtx, 2, 80, 16, Shuriken);

    GameVars.mainMenuDiv.classList.add("hidden");
    GameVars.gameDiv.classList.remove("hidden");
    GameVars.game = new Game();

    window.requestAnimationFrame(() => gameLoop());
}

// const drawCharacter = (ctx, pixelSize, x, y, sprite, colors, isInvert) => {
//     const charPixel = toPixelSize(pixelSize);
//     drawSprite(ctx, sprite, charPixel,  x,  y, colors, isInvert);
// }

const addKeyListenerEvents = () => {
    window.addEventListener('keydown', (e) => updateKeys(e.key, true));
    window.addEventListener('keyup', (e) => updateKeys(e.key, false));
    // window.addEventListener("click", (e) => initAudio());
}

const updateKeys = (key, isDown) => {
    const inputKey = getInputKey(key);
    const needsRedraw = GameVars.keys[inputKey] !== isDown;
    GameVars.keys[inputKey] = isDown;
}

const createGameElements = () => {
    GameVars.mainDiv = document.getElementById("main");
    GameVars.mainMenuDiv = createElem(GameVars.mainDiv, "div");
    GameVars.gameDiv = createElem(GameVars.mainDiv, "div", "game", ["hidden"]);
}

const gameLoop = () => {
    const now = getTime();
    elapsed = now - then;
    if (elapsed >= fpsInterval) {
        then = now - (elapsed % fpsInterval);
        GameVars.deltaTime = elapsed / 1000;
        GameVars.game.update();
        GameVars.game.draw();
    }
    window.requestAnimationFrame(() => gameLoop());
}

init();