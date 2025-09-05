export const genSmallBox = (ctx, startX, startY, endX, endY, pixelSize, color, bgColor) => {
    const conditionFn = (x, y, endX, endY) => {
        return (y === 0 && (x > 0 && x < endX)) ||
            (y === endY && (x > 0 && x < endX)) ||
            (x === 0 && (y > 0 && y < endY)) ||
            (x === endX && (y > 0 && y < endY));
    }
    if (bgColor) {
        genetateInsideBoxColor(ctx, startX, startY, endX, endY, pixelSize, bgColor);
    }
    generateBox(ctx, startX, startY, endX, endY, pixelSize, color, conditionFn);
};

export const generateBox = (ctx, startX, startY, endX, endY, pixelSize, color, conditionFn) => {
    for (let y = 0; y <= endY; y++) {
        for (let x = 0; x <= endX; x++) {
            if (conditionFn(x, y, endX, endY)) {
                ctx.fillStyle = color;
                ctx.fillRect(
                    Math.round((startX * pixelSize) + (x * pixelSize)),
                    Math.round((startY * pixelSize) + (y * pixelSize)),
                    pixelSize, pixelSize);
            }
        }
    }
};

export const generateSphere = (ctx, startX, startY, radius, pixelSize, color) => {
    const centerX = startX + radius;
    const centerY = startY + radius;
    const conditionFn = (x, y) => {
        return (Math.pow((x - centerX), 2) / Math.pow(radius, 2)) + (Math.pow((y - centerY), 2) / Math.pow(radius, 2)) < 1;
    }
    generateBox(ctx, startX, startY, startX + (radius * 2), startY + (radius * 2), pixelSize, color, conditionFn);
};

const genetateInsideBoxColor = (ctx, startX, startY, endX, endY, pixelSize, bgColor) => {
    ctx.fillStyle = bgColor;
    ctx.fillRect(
        Math.round((startX * pixelSize) + pixelSize),
        Math.round((startY * pixelSize) + pixelSize),
        Math.round((endX * pixelSize) - pixelSize),
        Math.round((endY * pixelSize) - pixelSize)
    );
};