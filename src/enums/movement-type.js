export const InputKey = {
    UP: "UP",
    DOWN: "DOWN",
    LEFT: "LEFT",
    RIGHT: "RIGHT",

    JUMP: "JUMP",
    ATK: "ATK",
}

export const getInputKey = (key) => {
    switch (key) {
        case "ArrowUp":
        case "w":
        case "W":
        case "Space":
            return InputKey.JUMP;

        case "ArrowDown":
        case "s":
        case "S":
            return InputKey.DOWN;

        case "ArrowLeft":
        case "a":
        case "A":
            return InputKey.LEFT;

        case "ArrowRight":
        case "d":
        case "D":
            return InputKey.RIGHT;

        case "Z":
        case "z":
            return InputKey.ATK;
    }
}