export function generateMap(size) {
    const tiles = [];

    for (let y = 0; y < size; y++) {
        tiles[y] = [];
        for (let x = 0; x < size; x++) {
            const isWall = Math.random() < 0.1;
            tiles[y][x] = isWall ? '#' : '.';
        }
    }

    return {
        size,
        tiles,
        draw(ctx) {
            ctx.font = '16px monospace';
            ctx.fillStyle = 'white';
            for (let y = 0; y < size; y++) {
                for (let x = 0; x < size; x++) {
                    ctx.fillText(tiles[y][x], x * 16, y * 16 + 16)
                }
            }
        }
    };
}
