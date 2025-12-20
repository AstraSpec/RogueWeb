/* 
    Handles chunks for the map
    Uses 128x128 tile chunks, with chunk types from the chunk registry
*/

export class GameMap {
    constructor (size, tileRegistry, chunkRegistry = null, gameState = null) {
        this.size = size; // Number of chunks (not tiles)
        this.tileRegistry = tileRegistry;
        this.chunkRegistry = chunkRegistry;
        this.gameState = gameState;
        // Get chunk size from gameState, default to 32
        this.chunkSize = gameState ? gameState.get('config.chunkSize', 32) : 32;
        this.chunks = new Map(); // Map of "chunkX,chunkY" -> Chunk data (just type, no tiles)
        this.chunkTiles = new Map(); // Map of "chunkX,chunkY" -> 2D array of tiles
    }

    // Gets the chunk coordinates for a given world position
    getChunkCoords(x, y) {
        const chunkX = Math.floor(x / this.chunkSize);
        const chunkY = Math.floor(y / this.chunkSize);
        const localX = x % this.chunkSize;
        const localY = y % this.chunkSize;
        
        // Handle negative coordinates
        const adjustedLocalX = localX < 0 ? this.chunkSize + localX : localX;
        const adjustedLocalY = localY < 0 ? this.chunkSize + localY : localY;
        
        return {
            chunkX,
            chunkY,
            localX: adjustedLocalX,
            localY: adjustedLocalY
        };
    }

    // Gets a chunk by its coordinates, assigning type from registry if it doesn't exisr
    getChunk(chunkX, chunkY) {
        const chunkKey = `${chunkX},${chunkY}`;
        
        // Assign chunk type from registry if it doesn't exist
        if (!this.chunks.has(chunkKey)) {
            let chunkType = 'plains'; // Default
            
            // Get available chunk types from registry
            if (this.chunkRegistry) {
                const chunkTypes = Array.from(this.chunkRegistry.itemsById.keys());
                if (chunkTypes.length > 0) {
                    // Randomly pick a chunk type from registry
                    chunkType = chunkTypes[Math.floor(Math.random() * chunkTypes.length)];
                }
            }
            
            this.chunks.set(chunkKey, {
                chunkX,
                chunkY,
                type: chunkType
            });
        }
        
        return this.chunks.get(chunkKey);
    }

    // Generates tiles for a chunk based on its type
    generateChunkTiles(chunkX, chunkY, chunkType) {
        const chunkKey = `${chunkX},${chunkY}`;
        const tiles = [];
        
        for (let y = 0; y < this.chunkSize; y++) {
            tiles[y] = [];
            for (let x = 0; x < this.chunkSize; x++) {
                const rand = Math.random();
                
                if (chunkType === 'forest') {
                    if (rand < 0.15) {
                        tiles[y][x] = "tree";
                    } else if (rand < 0.16) {
                        tiles[y][x] = "flower";
                    }
                    else if (rand < 0.17) {
                        tiles[y][x] = "rock";
                    }
                    else {
                        tiles[y][x] = "grass";
                    }
                } else if (chunkType === 'plains') {
                    if (rand < 0.025) {
                        tiles[y][x] = "tree";
                    } else {
                        tiles[y][x] = "grass";
                    }
                } else {
                    tiles[y][x] = "grass";
                }
            }
        }
        
        this.chunkTiles.set(chunkKey, tiles);
    }

    // Generates tiles for chunks around a given world position
    generateChunksAround(worldX, worldY, radius = 2) {
        const coords = this.getChunkCoords(worldX, worldY);
        const centerChunkX = coords.chunkX;
        const centerChunkY = coords.chunkY;
        
        for (let dy = -radius; dy <= radius; dy++) {
            for (let dx = -radius; dx <= radius; dx++) {
                const chunkX = centerChunkX + dx;
                const chunkY = centerChunkY + dy;
                const chunkKey = `${chunkX},${chunkY}`;
                
                // Get or create chunk
                const chunk = this.getChunk(chunkX, chunkY);
                
                // Generate tiles if not already generated
                if (chunk && !this.chunkTiles.has(chunkKey)) {
                    this.generateChunkTiles(chunkX, chunkY, chunk.type);
                }
            }
        }
    }

    // Get tile ID at world position
    getTileId(x, y) {
        const coords = this.getChunkCoords(x, y);
        const chunk = this.getChunk(coords.chunkX, coords.chunkY);
        
        if (!chunk) {
            return undefined;
        }
        
        const chunkKey = `${coords.chunkX},${coords.chunkY}`;
        const tiles = this.chunkTiles.get(chunkKey);
        
        // If tiles are generated, use them; otherwise return chunk type as fallback
        if (tiles) {
            return tiles[coords.localY][coords.localX];
        }
        
        // Fallback to chunk type if tiles not generated yet
        return chunk.type;
    }

    // Get total world size in tiles
    getWorldSize() {
        return this.size * this.chunkSize;
    }

    // Get all chunks (for rendering/debugging)
    getAllChunks() {
        return this.chunks;
    }
}
