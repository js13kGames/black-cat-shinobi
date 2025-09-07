import { GameState } from "./enums/game-state";
import { getInputKey, InputKey } from "./enums/movement-type";
import { Game } from "./game";
import { GameVars, toPixelSize } from "./game-variables";
import { CharacterFall, PlayerColors } from "./sprites/character";
import { generateBox, generateSphere, genSmallBox } from "./utilities/box-generator";
import { createElem, setElemSize } from "./utilities/elem-utilities"
import { randomNumb } from "./utilities/general-utilities";
import { drawPixelTextInCanvas } from "./utilities/text";
const { drawSprite } = require("./utilities/draw-utilities");

let mainDiv;

let mainMenuDiv;
let mainMenuCanv;
let mainMenuBtn;

let isShowingRetry;
let retryMenuDiv;
let retryMenuCanv;

let isShowingNextLevel;
let nextLevelDiv;
let nextLevelCanvas;

let isShowingFinishMenu;

let gameOverDiv;
let gameOverCanv;

let gameCompletedDiv;
let gameCompletedCanv;

let secondsPassed;
let oldTimeStamp = 0;

let timeoutID;
let skipDelayDuration = 0.5;
let skipDelayTimer = skipDelayDuration;

const init = () => {
    GameVars.updatePixelSize(window.innerWidth, window.innerHeight);

    addKeyListenerEvents();
    setResize();

    createGameElements();

    window.requestAnimationFrame(gameLoop);
}

const addKeyListenerEvents = () => {
    window.addEventListener('keydown', (e) => updateKeys(e.key, true));
    window.addEventListener('keyup', (e) => updateKeys(e.key, false));
    // window.addEventListener("click", (e) => initAudio());
}

const updateKeys = (key, isDown) => {
    GameVars.keys[getInputKey(key)] = isDown;
}

const setResize = () => {
    window.addEventListener("resize", () => {
        GameVars.updatePixelSize(window.innerWidth, window.innerHeight);
        drawMenus();
        GameVars.game && GameVars.game.setLevel();
    });
}

const createGameElements = () => {
    mainDiv = document.getElementById("main");
    GameVars.gameDiv = createElem(mainDiv, "div");

    mainMenuDiv = createElem(mainDiv, "div");
    mainMenuCanv = createElem(mainMenuDiv, "canvas");
    mainMenuBtn = createElem(mainMenuDiv, "canvas", null, null, null, null, null, () => startGame());

    retryMenuDiv = createElem(mainDiv, "div", null, ["hidden"]);
    retryMenuCanv = createElem(retryMenuDiv, "canvas", null, null, null, null, null, () => skipMenu());

    nextLevelDiv = createElem(mainDiv, "div", null, ["hidden"]);
    nextLevelCanvas = createElem(nextLevelDiv, "canvas", null, null, null, null, null, () => skipMenu());

    gameOverDiv = createElem(mainDiv, "div", null, ["hidden"]);
    gameOverCanv = createElem(gameOverDiv, "canvas", null, null, null, null, null, () => skipMenu());

    gameCompletedDiv = createElem(mainDiv, "div", null, ["hidden"]);
    gameCompletedCanv = createElem(gameCompletedDiv, "canvas", null, null, null, null, null, () => skipMenu());

    drawMenus();
}

const drawMenus = () => {
    setElemSize(mainMenuCanv, GameVars.gameW, GameVars.gameH);
    setElemSize(mainMenuBtn, toPixelSize(66), toPixelSize(16));

    setElemSize(retryMenuCanv, GameVars.gameW, GameVars.gameH);

    setElemSize(gameOverCanv, GameVars.gameW, GameVars.gameH);

    setElemSize(nextLevelCanvas, GameVars.gameW, GameVars.gameH);

    setElemSize(gameCompletedCanv, GameVars.gameW, GameVars.gameH);

    drawMainMenu();
    drawGameOverMenu();
    drawGameCompletedMenu();
}

const drawMainMenu = () => {
    const mainMenuCtx = mainMenuCanv.getContext("2d");
    clearCanvas(mainMenuCtx, mainMenuCanv, "#030f26");

    const moonRadius = mainMenuCanv.height / 2 / toPixelSize(1);
    const moonX = mainMenuCanv.width / 2 / toPixelSize(2) - moonRadius + 20;
    generateSphere(mainMenuCtx, moonX + 5, 5, moonRadius, toPixelSize(1), "#9bf2fa");
    generateSphere(mainMenuCtx, moonX - 30, 8, moonRadius - 3, toPixelSize(1), "#030f26");
    generateBox(mainMenuCtx, 0, 0, mainMenuCanv.width / toPixelSize(1), mainMenuCanv.height / toPixelSize(1), toPixelSize(1), "#9bf2fa", () => randomNumb(1000) < 1);

    drawCharacter(mainMenuCtx, 2, Math.round(mainMenuCanv.width / 2 / toPixelSize(2)) - CharacterFall[0][0].length / 2, Math.round(mainMenuCanv.height / 2 / toPixelSize(2)) - CharacterFall[0].length / 2, CharacterFall[0], PlayerColors);

    genSmallBox(mainMenuCtx, -1, -1, Math.floor(mainMenuCanv.width / toPixelSize(2)) + 2, 19, toPixelSize(2), "#060606", "#060606");
    drawPixelTextInCanvas("black cat", mainMenuCtx, toPixelSize(3), Math.round(GameVars.gameW / 2 / toPixelSize(3)), 4, "#9bf2fa", 1);
    drawPixelTextInCanvas("shinobi", mainMenuCtx, toPixelSize(2), Math.round(GameVars.gameW / 2 / toPixelSize(2)), 14, "#9bf2fa", 1);

    genSmallBox(mainMenuCtx, -1, Math.floor(mainMenuCanv.height / toPixelSize(2)) - 8, Math.floor(mainMenuCanv.width / toPixelSize(2)) + 2, 17, toPixelSize(2), "#060606", "#060606");
    drawPixelTextInCanvas("js13kgames 2025 igor estevao", mainMenuCtx, toPixelSize(1), GameVars.gameWdAsPixels / 2, GameVars.gameHgAsPixels - 8, "#9bf2fa", 1);

    const mainMenuBtnCtx = mainMenuBtn.getContext("2d");
    mainMenuBtn.style.translate = ((GameVars.gameW / 2) - (mainMenuBtn.width / 2)) + 'px ' + (mainMenuCanv.height - toPixelSize(36) - mainMenuBtn.height / 2) + 'px';
    genSmallBox(mainMenuBtnCtx, 0, 0, 32, 6, toPixelSize(2), "#060606", "#060606");
    drawPixelTextInCanvas("start game", mainMenuBtnCtx, toPixelSize(1), 32, 7, "#9bf2fa", 1);
}

const drawCharacter = (ctx, pixelSize, x, y, sprite, colors, isInvert) => {
    const charPixel = toPixelSize(pixelSize);
    drawSprite(ctx, sprite, charPixel, x, y, colors, isInvert);
}

const drawGameOverMenu = () => {
    const gameOverCtx = gameOverCanv.getContext("2d");
    clearCanvas(gameOverCtx, gameOverCanv, "#452228dd");
    drawPixelTextInCanvas("game over", gameOverCtx, GameVars.pixelSize, GameVars.gameWdAsPixels / 2, (GameVars.gameHgAsPixels / 2) - 2, "#9bf2fa", 3);
}

const drawGameCompletedMenu = () => {
    const gameCompletedCtx = gameCompletedCanv.getContext("2d");
    clearCanvas(gameCompletedCtx, gameCompletedCanv, "#030f26dd");
    drawPixelTextInCanvas("game completed", gameCompletedCtx, GameVars.pixelSize, GameVars.gameWdAsPixels / 2, (GameVars.gameHgAsPixels / 2) - 10, "#9bf2fa", 2);
    drawPixelTextInCanvas("thank you for playing", gameCompletedCtx, GameVars.pixelSize, GameVars.gameWdAsPixels / 2, (GameVars.gameHgAsPixels / 2) + 2, "#9bf2fa", 1);
}

const drawRetryMenu = () => {
    const retryMenuCtx = retryMenuCanv.getContext("2d");
    clearCanvas(retryMenuCtx, retryMenuCanv, "#452228dd");
    drawPixelTextInCanvas("level - " + (GameVars.game?.levelIndex + 1), retryMenuCtx, GameVars.pixelSize, GameVars.gameWdAsPixels / 2, (GameVars.gameHgAsPixels / 2) - 10, "#9bf2fa", 2);
    drawPixelTextInCanvas("lives " + (GameVars.game?.numberOfRetrys), retryMenuCtx, GameVars.pixelSize, GameVars.gameWdAsPixels / 2, (GameVars.gameHgAsPixels / 2) + 2, "#9bf2fa", 1);
}

const drawNextLevelMenu = () => {
    const nextLevelCtx = nextLevelCanvas.getContext("2d");
    clearCanvas(nextLevelCtx, nextLevelCanvas, "#030f26dd");
    drawPixelTextInCanvas("level - " + GameVars.game?.levelIndex, nextLevelCtx, GameVars.pixelSize, GameVars.gameWdAsPixels / 2, (GameVars.gameHgAsPixels / 2) - 10, "#9bf2fa", 2);
    drawPixelTextInCanvas("completed", nextLevelCtx, GameVars.pixelSize, GameVars.gameWdAsPixels / 2, (GameVars.gameHgAsPixels / 2) + 2, "#9bf2fa", 1);
}

const clearCanvas = (ctx, canvas, color) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

const startGame = () => {
    mainMenuDiv.classList.add("hidden");
    GameVars.gameDiv.classList.remove("hidden");
    GameVars.gameDiv.innerHTML = "";
    GameVars.game = new Game();
    GameVars.game.draw();
}

const gameLoop = (timeStamp) => {
    secondsPassed = (timeStamp - oldTimeStamp) / 1000;
    oldTimeStamp = timeStamp;
    GameVars.deltaTime = Math.min(secondsPassed, 0.1);
    if (GameVars.game) {
        handleRetryScreen();
        handleNextLevelScreen();
        handleGameOverScreen();
        handleGameCompletedScreen();
        if (GameVars.game.gameState === GameState.RUNNING) GameVars.game.update();
        if (GameVars.keys[InputKey.ENTER]) skipMenu();
    } else {
        if (skipDelayTimer >= skipDelayDuration) {
            if (GameVars.keys[InputKey.ENTER]) startGame();
        } else {
            skipDelayTimer += GameVars.deltaTime;
        }
    }
    window.requestAnimationFrame(gameLoop);
}

const skipMenu = () => {
    if (GameVars.game.gameState === GameState.RETRY && isShowingRetry) {
        skipRetryScreen();
    } else if (GameVars.game.gameState === GameState.NEXT_LEVEL && isShowingNextLevel) {
        skipNextLevelScreen();
    } else if (GameVars.game.gameState === GameState.GAME_OVER && isShowingFinishMenu) {
        skipDelayTimer = 0;
        skipFinishMenu(gameOverDiv);
    } else if (GameVars.game.gameState === GameState.GAME_COMPLETE && isShowingFinishMenu) {
        skipDelayTimer = 0;
        skipFinishMenu(gameCompletedDiv);
    }
    GameVars.game?.skip();
}

const handleRetryScreen = () => {
    if (GameVars.game.gameState === GameState.RETRY && !isShowingRetry) {
        isShowingRetry = true;
        drawRetryMenu();
        retryMenuDiv.classList.remove("hidden");
    } else if (GameVars.game.gameState !== GameState.RETRY && isShowingRetry) {
        skipRetryScreen();
    }
}

const skipRetryScreen = () => {
    isShowingRetry = false;
    retryMenuDiv.classList.add("hidden");
}

const handleNextLevelScreen = () => {
    if (GameVars.game.gameState === GameState.NEXT_LEVEL && !isShowingNextLevel) {
        isShowingNextLevel = true;
        drawNextLevelMenu();
        nextLevelDiv.classList.remove("hidden");
    } else if (GameVars.game.gameState !== GameState.NEXT_LEVEL && isShowingNextLevel) {
        skipNextLevelScreen();
    }
}

const skipNextLevelScreen = () => {
    isShowingNextLevel = false;
    nextLevelDiv.classList.add("hidden");
}

const handleGameOverScreen = () => {
    if (GameVars.game.gameState === GameState.GAME_OVER && !isShowingFinishMenu) {
        isShowingFinishMenu = true;
        gameOverDiv.classList.remove("hidden");
        timeoutID = setTimeout(() => {
            skipDelayTimer = skipDelayDuration;
            skipFinishMenu(gameOverDiv);
        }, 2000)
    }
}

const handleGameCompletedScreen = () => {
    if (GameVars.game.gameState === GameState.GAME_COMPLETE && !isShowingFinishMenu) {
        isShowingFinishMenu = true;
        gameCompletedDiv.classList.remove("hidden");
        timeoutID = setTimeout(() => {
            skipDelayTimer = skipDelayDuration;
            skipFinishMenu(gameCompletedDiv);
        }, 4000)
    }
}

const skipFinishMenu = (div) => {
    clearTimeout(timeoutID);
    isShowingFinishMenu = false;
    mainMenuDiv.classList.remove("hidden");
    div.classList.add("hidden");
    GameVars.gameDiv.classList.add("hidden");
    GameVars.game = null;
}

init();