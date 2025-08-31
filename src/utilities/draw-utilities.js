export const drawSprite = (ctx, sprite, pixelSize = 1, startX = 0, startY = 0, colorIds = null, invertX = false, invertY = false) => {
    sprite.forEach((row, y) => {
        y = invertY ? row.length - 1 - y : y;
        row.forEach((val, x) => {
            x = invertX ? row.length - 1 - x : x;
            if (val !== null) {
                ctx.fillStyle = colorIds ? colorIds[val] || val : val;
                ctx.fillRect(
                    (startX * pixelSize) + (x * pixelSize),
                    (startY * pixelSize) + (y * pixelSize),
                    pixelSize,
                    pixelSize);
            }
        })
    });
};