const storeId = 'igorfie-black-cat-shinobi';

let highScore = parseInt(localStorage.getItem(storeId)) || 0;
let score;

const updatePixelSize = (width, height) => {
    GameVars.lastGameW = GameVars.gameW;
    GameVars.lastGameH = GameVars.gameH;

    GameVars.gameW = width;
    GameVars.gameHalfW = width / 2;
    GameVars.gameH = height;
    GameVars.gameHalfH = height / 2;

    GameVars.pixelSize = pixelCal(2, 4);

    GameVars.gameWdAsPixels = width / GameVars.pixelSize;
    GameVars.gameHgAsPixels = height / GameVars.pixelSize;

    GameVars.roomWidth = GameVars.gameWdAsPixels / 16;
    GameVars.roomHeight = GameVars.gameHgAsPixels / 16;
}

const pixelCal = (min, max) => {
    let hgPixelSize = Math.round((GameVars.gameH - 270) * ((max - min) / (1100 - 270)) + min);
    let wdPixelSize = Math.round((GameVars.gameW - 480) * ((max - min) / (1000 - 480)) + min);
    let pixelSize = hgPixelSize < wdPixelSize ? hgPixelSize : wdPixelSize;
    return pixelSize >= 1 ? pixelSize + 1 : 1;
};

let isMobile;

let lastGameW;
let lastGameH;

let gameW;
let gameHalfW;
let gameH;
let gameHalfH;

let pixelSize;

let gameWdAsPixels;
let gameHgAsPixels;

let roomWidth;
let roomHeight;

let levelW;
let levelH;

let mainDiv;
let mainMenuDiv;
let gameDiv;

let game;
let maxLives = 3;

let sound;


let fps = 60;
let deltaTime;

let movePad;
let actionPad;

let keys = {};

let gravity = 0.5;

export const GameVars = {
    storeId,
    highScore,
    score,

    isMobile,

    lastGameW,
    lastGameH,

    gameW,
    gameHalfW,
    gameH,
    gameHalfH,

    pixelSize,
    gameWdAsPixels,
    gameHgAsPixels,

    roomWidth,
    roomHeight,

    levelH,
    levelW,

    mainDiv,
    mainMenuDiv,
    gameDiv,

    game,
    maxLives,
    sound,

    fps,
    deltaTime,

    movePad,
    actionPad,

    keys,

    gravity,

    updatePixelSize,
}

export const toPixelSize = (value = 1) => {
    return value * GameVars.pixelSize;
}

export const removePixelSize = (value) => {
    return value / GameVars.pixelSize;
}

export const toBoardPixelSize = (value) => {
    return value * GameVars.boardPixelSize;
}

export const removeBoardPixelSize = (value) => {
    return value / GameVars.boardPixelSize;
}

export const convertToMapPixel = (value, amount = 2) => {
    return value / toPixelSize(amount);
};