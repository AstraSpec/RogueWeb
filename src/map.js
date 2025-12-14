/* 
    Handles randomly generating the tiles and chunks for the map
*/

export class Map {
    constructor (size) {
        this.size = size;
        this.tiles = this.generateMap();
    }

    // Returns array of tiles for surrounding map
    generateMap() {
        const tiles = [];

        // Generates the individual tiles
        for (let y = 0; y < this.size; y++) {
            tiles[y] = [];
            for (let x = 0; x < this.size; x++) {
                const isWall = Math.random() < 0.1;
                tiles[y][x] = isWall ? '#' : '.';
            }
        }

        return tiles;
    }
}
