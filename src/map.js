/* 
    Handles randomly generating the tiles and chunks for the map
*/

export class Map {
    constructor (size, tileRegistry) {
        this.size = size;
        this.tileRegistry = tileRegistry;
        this.tiles = this.generateMap();
    }

    // Returns array of tiles for surrounding map
    generateMap() {
        const tiles = [];

        // Generates the individual tiles
        for (let y = 0; y < this.size; y++) {
            tiles[y] = [];
            for (let x = 0; x < this.size; x++) {
                const rand = Math.random();
                
                // Spawn probabilities
                let tile;
                if (rand < 0.25) {
                    tile = this.tileRegistry.getTileById("tree");
                } else {
                    tile = this.tileRegistry.getTileById("grass");
                }

                tiles[y][x] = tile ? tile.char : ' ';
            }
        }

        return tiles;
    }

    // Get tile ID at position
    getTileId(x, y) {
        if (x < 0 || y < 0 || x >= this.size || y >= this.size) {
            return undefined;
        }
        
        const char = this.tiles[y][x];
        if (this.tileRegistry) {
            const tile = this.tileRegistry.getTileByChar(char);
            return tile ? tile.id : undefined;
        }
        return undefined;
    }

    // Get tile character at position
    getTileChar(x, y) {
        if (x < 0 || y < 0 || x >= this.size || y >= this.size) {
            return undefined;
        }
        return this.tiles[y][x];
    }
}
