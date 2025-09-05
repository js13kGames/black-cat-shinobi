import { GameState } from "./enums/game-state";
import { getInputKey, InputKey } from "./enums/movement-type";
import { Game } from "./game";
import { convertToMapPixel, GameVars, toPixelSize } from "./game-variables";
import { CharacterAtk, CharacterFall, CharacterFrontIddle, CharacterJump, CharacterRun, CharacterSideIddle, EnemyColors, PlayerColors, Shuriken } from "./sprites/character";
import { generateBox, generateSphere, genSmallBox } from "./utilities/box-generator";
import { createElem } from "./utilities/elem-utilities"
import { randomNumb } from "./utilities/general-utilities";
import { drawPixelTextInCanvas } from "./utilities/text";
const { drawSprite } = require("./utilities/draw-utilities");

let mainDiv;

let mainMenuDiv;

let isShowingRetry;
let retryMenuDiv;
let retryMenuCanv;

let isShowingGameOver;
let gameOverDiv;

let isShowingNextLevel;
let nextLevelDiv;
let nextLevelCanvas;

let isShowingGameCompleted;
let gameCompletedDiv;

let secondsPassed;
let oldTimeStamp;

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

    window.requestAnimationFrame(gameLoop);
}

const addKeyListenerEvents = () => {
    window.addEventListener('keydown', (e) => updateKeys(e.key, true));
    window.addEventListener('keyup', (e) => updateKeys(e.key, false));
    // window.addEventListener("click", (e) => initAudio());
}

const updateKeys = (key, isDown) => {
    const inputKey = getInputKey(key);
    // const needsRedraw = GameVars.keys[inputKey] !== isDown;
    GameVars.keys[inputKey] = isDown;
}

const createGameElements = () => {
    mainDiv = document.getElementById("main");
    GameVars.gameDiv = createElem(mainDiv, "div");
    createMainMenu();
    createRetryMenu();
    createNextLevelMenu();
    createGameOverMenu();
    createGameCompletedMenu();
}

const createMainMenu = () => {
    mainMenuDiv = createElem(mainDiv, "div");
    const mainMenuCanv = createElem(mainMenuDiv, "canvas", null, null, GameVars.gameW, GameVars.gameH);
    const mainMenuCtx = mainMenuCanv.getContext("2d");

    mainMenuCtx.fillStyle = "#030f26";
    mainMenuCtx.fillRect(0, 0, mainMenuCanv.width, mainMenuCanv.height);
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
    drawPixelTextInCanvas("js13kgames 2025 - igor estevao", mainMenuCtx, toPixelSize(1), GameVars.gameWdAsPixels / 2, GameVars.gameHgAsPixels - 8, "#9bf2fa", 1);

    const mainMenuBtn = createElem(mainMenuDiv, "canvas", null, null, toPixelSize(66), toPixelSize(16), false, null, () => startGame());
    const mainMenuBtnCtx = mainMenuBtn.getContext("2d");

    mainMenuBtn.style.translate = ((GameVars.gameW / 2) - (mainMenuBtn.width / 2)) + 'px ' + (mainMenuCanv.height - toPixelSize(36) - mainMenuBtn.height / 2) + 'px';
    genSmallBox(mainMenuBtnCtx, 0, 0, 32, 6, toPixelSize(2), "#060606", "#060606");
    drawPixelTextInCanvas("start game", mainMenuBtnCtx, toPixelSize(1), 32, 7, "#9bf2fa", 1);
}

const drawCharacter = (ctx, pixelSize, x, y, sprite, colors, isInvert) => {
    const charPixel = toPixelSize(pixelSize);
    drawSprite(ctx, sprite, charPixel, x, y, colors, isInvert);
}

const createRetryMenu = () => {
    retryMenuDiv = createElem(mainDiv, "div", null, ["hidden"]);
    retryMenuCanv = createElem(retryMenuDiv, "canvas", null, null, GameVars.gameW, GameVars.gameH);
}

const createNextLevelMenu = () => {
    nextLevelDiv = createElem(mainDiv, "div", null, ["hidden"]);
    nextLevelCanvas = createElem(nextLevelDiv, "canvas", null, null, GameVars.gameW, GameVars.gameH);
}

const createGameOverMenu = () => {
    gameOverDiv = createElem(mainDiv, "div", null, ["hidden"]);
    const gameOverCanv = createElem(gameOverDiv, "canvas", null, null, GameVars.gameW, GameVars.gameH, false, "#452228dd");
    const gameOverCtx = gameOverCanv.getContext("2d");
    drawPixelTextInCanvas("GAME OVER", gameOverCtx, GameVars.pixelSize, GameVars.gameWdAsPixels / 2, (GameVars.gameHgAsPixels / 2) - 2, "#9bf2fa", 3);
}

const createGameCompletedMenu = () => {
    gameCompletedDiv = createElem(mainDiv, "div", null, ["hidden"]);
    const gameCompletedCanv = createElem(gameCompletedDiv, "canvas", null, null, GameVars.gameW, GameVars.gameH, false, "#030f26dd");
    const gameCompletedCtx = gameCompletedCanv.getContext("2d");
    drawPixelTextInCanvas("game completed", gameCompletedCtx, GameVars.pixelSize, GameVars.gameWdAsPixels / 2, (GameVars.gameHgAsPixels / 2) - 10, "#9bf2fa", 2);
    drawPixelTextInCanvas("thank you for playing", gameCompletedCtx, GameVars.pixelSize, GameVars.gameWdAsPixels / 2, (GameVars.gameHgAsPixels / 2) + 2, "#9bf2fa", 1);
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
    GameVars.deltaTime = secondsPassed;
    if (GameVars.game) {
        handleRetryScreen();
        handleNextLevelScreen();
        handleGameOverScreen();
        handleGameCompletedScreen();

        if (GameVars.game?.gameState === GameState.RUNNING) {
            GameVars.game.update();
        }
    } else {
        if (GameVars.keys[InputKey.ENTER]) startGame();
    }
    window.requestAnimationFrame(gameLoop);
}

const handleRetryScreen = () => {
    if (GameVars.game?.gameState === GameState.RETRY && !isShowingRetry) {
        isShowingRetry = true;
        const retryMenuCtx = retryMenuCanv.getContext("2d");
        retryMenuCtx.clearRect(0, 0, retryMenuCanv.width, retryMenuCanv.height);
        retryMenuCtx.fillStyle = "#030f26dd";
        retryMenuCtx.fillRect(0, 0, retryMenuCanv.width, retryMenuCanv.height);
        drawPixelTextInCanvas("level " + (GameVars.game?.levelIndex + 1), retryMenuCtx, GameVars.pixelSize, GameVars.gameWdAsPixels / 2, (GameVars.gameHgAsPixels / 2) - 10, "#9bf2fa", 2);
        drawPixelTextInCanvas("lives " + (GameVars.game?.numberOfRetrys), retryMenuCtx, GameVars.pixelSize, GameVars.gameWdAsPixels / 2, (GameVars.gameHgAsPixels / 2) + 2, "#9bf2fa", 1);
        retryMenuDiv.classList.remove("hidden");
    } else if (GameVars.game?.gameState !== GameState.RETRY && isShowingRetry) {
        isShowingRetry = false;
        retryMenuDiv.classList.add("hidden");
    }
}

const handleNextLevelScreen = () => {
    if (GameVars.game?.gameState === GameState.NEXT_LEVEL && !isShowingNextLevel) {
        isShowingNextLevel = true;
        const nextLevelCtx = nextLevelCanvas.getContext("2d");
        nextLevelCtx.clearRect(0, 0, nextLevelCanvas.width, nextLevelCanvas.height);
        nextLevelCtx.fillStyle = "#030f26dd";
        nextLevelCtx.fillRect(0, 0, nextLevelCanvas.width, nextLevelCanvas.height);
        drawPixelTextInCanvas("level " + GameVars.game?.levelIndex, nextLevelCtx, GameVars.pixelSize, GameVars.gameWdAsPixels / 2, (GameVars.gameHgAsPixels / 2) - 10, "#9bf2fa", 2);
        drawPixelTextInCanvas("completed", nextLevelCtx, GameVars.pixelSize, GameVars.gameWdAsPixels / 2, (GameVars.gameHgAsPixels / 2) + 2, "#9bf2fa", 1);
        nextLevelDiv.classList.remove("hidden");
    } else if (GameVars.game?.gameState !== GameState.NEXT_LEVEL && isShowingNextLevel) {
        isShowingNextLevel = false;
        nextLevelDiv.classList.add("hidden");
    }
}

const handleGameOverScreen = () => {
    if (GameVars.game?.gameState === GameState.GAME_OVER && !isShowingGameOver) {
        isShowingGameOver = true;
        gameOverDiv.classList.remove("hidden");
        setTimeout(() => {
            isShowingGameOver = false;
            mainMenuDiv.classList.remove("hidden");
            gameOverDiv.classList.add("hidden");
            GameVars.gameDiv.classList.add("hidden");
            GameVars.game = null;
        }, 2000)
    }
}

const handleGameCompletedScreen = () => {
    if (GameVars.game?.gameState === GameState.GAME_COMPLETE && !isShowingGameCompleted) {
        isShowingGameCompleted = true;
        gameCompletedDiv.classList.remove("hidden");
        setTimeout(() => {
            isShowingGameCompleted = false;
            mainMenuDiv.classList.remove("hidden");
            gameCompletedDiv.classList.add("hidden");
            GameVars.gameDiv.classList.add("hidden");
            GameVars.game = null;
        }, 4000)
    }
}

init();