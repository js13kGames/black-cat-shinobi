export const InputKey = {
    UP: 0,
    DOWN: 1,
    LEFT: 2,
    RIGHT: 3,

    JUMP: 4,
    ATK: 5,

    ENTER: 9,
    ESC: 10
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

        case " ":
        case "Enter":
            return InputKey.ENTER;

        case "Escape":
            return InputKey.ESC;
    }
}