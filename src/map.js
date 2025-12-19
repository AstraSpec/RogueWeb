/* 
    Handles randomly generating the tiles and chunks for the map
*/

export class Map {
    constructor (size, tileRegistry) {
        this.size = size;
        this.tileRegistry = tileRegistry;
        this.tiles = this.generateMap();
    }

    // Returns array of tile IDs for surrounding map
    generateMap() {
        const tiles = [];

        // Generates the individual tiles
        for (let y = 0; y < this.size; y++) {
            tiles[y] = [];
            for (let x = 0; x < this.size; x++) {
                const rand = Math.random();
                
                // Spawn probabilities - store tile IDs
                if (rand < 0.25) {
                    tiles[y][x] = "tree";
                } else {
                    tiles[y][x] = "grass";
                }
            }
        }

        return tiles;
    }

    // Get tile ID at position
    getTileId(x, y) {
        if (x < 0 || y < 0 || x >= this.size || y >= this.size) {
            return undefined;
        }
        return this.tiles[y][x];
    }
}
