export const drawSprite = (ctx, sprite, pixelSize = 1, posX = 0, posY = 0, colorIds = null, invertX = false, invertY = false, rotate = false) => {
    const targetY = sprite.length;
    const targetX = sprite[0].length;
    let x, y, value;
    for (let loopY = 0; loopY < targetY; loopY++) {
        y = invertY ? sprite.length - 1 - loopY : loopY;
        for (let loopX = 0; loopX < targetX; loopX++) {
            x = invertX ? sprite[0].length - 1 - loopX : loopX;
            value = rotate ? sprite[x][y] : sprite[y][x];
            if (value !== null) {
                ctx.fillStyle = colorIds ? colorIds[value] || value : value;
                ctx.fillRect(
                    (posX * pixelSize) + (loopX * pixelSize),
                    (posY * pixelSize) + (loopY * pixelSize),
                    pixelSize,
                    pixelSize);
            }
        }
    }
};